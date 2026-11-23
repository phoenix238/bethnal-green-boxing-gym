"""Run against the built Worker in Chromium. Three devices share one real SQLite database."""
import base64
import json
import os
import re
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
origin="https://rehearsal.test"
worker=subprocess.Popen(["node","test/browser-worker.mjs"],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True)
def invoke(payload):
    worker.stdin.write(json.dumps(payload)+"\n")
    worker.stdin.flush()
    result=json.loads(worker.stdout.readline())
    assert not result.get("failure"), result
    return result
def route_for(device):
    def dispatch(route):
        r=route.request
        headers=r.headers
        if r.method=="POST": headers["origin"]=origin
        reply=invoke(dict(device=device,url=r.url,headers=headers,method=r.method,body=r.post_data))
        route.fulfill(status=reply["status"],headers=reply["headers"],body=base64.b64decode(reply["body"]))
    return dispatch
def details(page,title):
    panel=page.locator("details").filter(has=page.locator("summary").get_by_text(title,exact=True))
    if panel.get_attribute("open") is None:
        panel.locator("summary").click()
    return panel
def submit(f):
    f.get_by_role("button").click()
def fill(f,fields):
    for k,v in fields.items(): f.locator('[name="'+k+'"]').fill(v)
def ok(page):
    expect(page.locator("#message")).to_have_text("Saved.")
try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.getenv("CHROMIUM_PATH","/usr/bin/chromium"),args=["--no-sandbox"])
        def device(name,w,h,path):
            ctx=browser.new_context(viewport={"width":w,"height":h},timezone_id="Europe/London")
            ctx.route(origin+"/**",route_for(name))
            page=ctx.new_page();page.set_default_timeout(4000);page.goto(origin+path);return page
        staff=device("staff",1280,800,"/#signin")
        staff.get_by_role("button",name="Load rehearsal class").click();ok(staff)
        phone=device("phone",390,844,"/#signup")
        signup=phone.locator('form[data-cmd="signup"]')
        fill(signup,dict(name="Fictional Taylor",dob="1997-05-03",email="taylor@example.invalid",signer="Fictional Taylor",referredBy="AM42"))
        signup.get_by_role("checkbox",name=re.compile("I have read")).check();submit(signup)
        expect(phone.locator("#message")).to_contain_text("Member created")
        ref=re.search(r'reference is ([A-Z0-9]+)',phone.locator("#message").inner_text()).group(1)
        tablet=device("tablet",820,1180,"/kiosk")
        for _ in range(2):
            f=tablet.locator('form[data-cmd="checkin"]');fill(f,{"ref":ref});submit(f)
            expect(tablet.locator("#message")).to_contain_text("Request received")
        expect(tablet.get_by_text("Fictional Taylor")).to_have_count(0)
        phone.goto(origin+"/#signin");expect(phone.get_by_role("heading",name="My club record")).to_be_visible()
        expect(phone.get_by_text("-£10.00",exact=True)).to_be_visible()
        staff.reload()
        panel=details(staff,"Cash and transfers");cash=panel.locator('form[data-cmd="cash"]')
        cash.locator('[name=ref]').select_option(ref);fill(cash,{"amount":"10"});submit(cash);ok(staff)
        phone.reload();expect(phone.get_by_text("£0.00",exact=True).first).to_be_visible()
        register=details(staff,"Members and consent")
        expect(register.get_by_role("row").filter(has_text="AM42")).to_contain_text("£5.00")
        assisted=details(staff,"Staff-assisted signup").locator("form")
        fill(assisted,dict(name="Youth Rehearsal",dob="2012-02-04",guardian="Demo Guardian",contact="guardian@example.invalid",signer="Youth Rehearsal"))
        assisted.get_by_role("checkbox",name=re.compile("I have read")).check();submit(assisted)
        expect(staff.locator("#message")).to_contain_text("Member created")
        child=re.search(r'reference is ([A-Z0-9]+)',staff.locator("#message").inner_text()).group(1)
        expect(register.get_by_role("row").filter(has_text=child)).to_contain_text("Pending")
        f=register.locator('form[data-cmd="consent"]');f.locator('[name=ref]').select_option(child)
        fill(f,dict(guardian="Demo Guardian",relationship="Parent",when="2026-11-24T17:55",terms="One fictional training session"));submit(f);ok(staff)
        f=register.locator('form[data-cmd="clear"]');f.locator('[name=ref]').select_option(child)
        fill(f,{"reason":"Checked practice consent"});f.locator('[name=cleared]').check();submit(f);ok(staff)
        bank=details(staff,"After class · bank and email rehearsal")
        f=bank.locator('form[data-cmd="fixtureBank"]');fill(f,dict(transactionId="fixture-001",reference="unknown",payer="Fictional Taylor",amount="15"));submit(f);ok(staff)
        expect(panel.get_by_role("row").filter(has_text="fixture-001")).to_contain_text("Review · "+ref)
        f=panel.locator('form[data-cmd="review"]');f.locator('[name=id]').select_option("bank/fixture-001");f.locator('[name=ref]').select_option(ref)
        fill(f,{"reason":"Confirmed in practice register"});submit(f);ok(staff)
        phone.reload();expect(phone.get_by_text("£15.00",exact=True).first).to_be_visible()
        f=panel.locator('form[data-cmd="void"]');f.locator('[name=id]').select_option("bank/fixture-001");fill(f,{"reason":"Reverse simulated error"});submit(f);ok(staff)
        phone.reload();expect(phone.locator(".card").first).to_contain_text("£0.00")
        invoke({"time":"2026-11-24T19:40:00Z"})
        f=tablet.locator("form");fill(f,{"ref":child});submit(f);expect(f.get_by_role("alert")).to_contain_text("closed")
        f=details(staff,"Class times and register").locator('form[data-cmd="attendance"]');f.locator('[name=ref]').select_option(child)
        f.locator('[name=present]').check();f.locator('[name=billable]').check();fill(f,{"reason":"Confirmed late arrival"});submit(f);ok(staff)
        f=bank.locator('form[data-cmd="refresh"]');f.get_by_role("checkbox").check();submit(f);ok(staff)
        expect(bank).to_contain_text("Bank refresh overdue")
        f=bank.locator('form[data-cmd="deliver"]');f.get_by_role("checkbox").check();submit(f);ok(staff)
        expect(bank).to_contain_text("Email unavailable")
        submit(bank.locator('form[data-cmd="deliver"]'));ok(staff);expect(bank).to_contain_text("Delivered in rehearsal")
        for page in [phone,tablet,staff]:
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Horizontal overflow"
        print("Passed Chromium rehearsal: member phone, shared tablet, coach desk, assisted junior, consent, cash, referral, bank review, correction, late arrival, feed and email outages.")
        browser.close()
finally:
    worker.terminate();worker.wait()
