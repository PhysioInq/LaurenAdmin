# Documents

Branded documents produced for Physio Inq / Pinq Care.

## Care About Referrals — Intake Process

`Care About Referrals - Intake Process.docx` — process document for Charlotte (Intake) covering
Care About aged care referrals arriving into the `carepartners@physioinq.com.au` shared inbox:
what arrives, HubSpot deal creation (CAREINQ pipeline, referral partner stage), booking into
Jahari's or Tom's diary, orange referral checks, and exception handling.

Pinq Care branding. Status: Draft.

### Regenerating it

`build-care-about-doc.js` builds the .docx from scratch, so edits should be made there rather
than in Word if the file is going to be rebuilt later.

```bash
npm install docx
node build-care-about-doc.js "Care About Referrals - Intake Process.docx"
```

The script reads the Pinq Care logo from the `physio-inq-branding` skill's `assets/` directory.
Body font is set to Arial — swap `FONT` to `Roboto` if the house font is installed wherever the
document gets edited.
