const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  Header, Footer, ImageRun, PageNumber, LevelFormat, convertInchesToTwip,
  TabStopType,
} = require('docx');

const NAVY = '003054';
const MAGENTA = 'D82460';
const BODY = '262626';
const FONT = 'Arial';
const ASSETS = '/root/.claude/skills/physio-inq-branding/assets/';

const PAGE_W = 12240 - convertInchesToTwip(1) * 2; // Letter? no -> A4 default
// Use A4 (default): 11906 dxa wide, 1in margins each side
const CONTENT_W = 11906 - convertInchesToTwip(1) * 2; // 9026

// ---------- helpers ----------
const t = (text, opts = {}) => new TextRun({ text, font: FONT, color: opts.color || BODY, size: opts.size || 21, bold: opts.bold, italics: opts.italics });

const p = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after === undefined ? 140 : opts.after, before: opts.before || 0, line: 276 },
    alignment: opts.alignment,
    indent: opts.indent,
    children: Array.isArray(text) ? text : [t(text, opts)],
  });

const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text, font: FONT, color: NAVY, size: 40, bold: true })],
  });

const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, font: FONT, color: NAVY, size: 26, bold: true })],
  });

const h3 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: FONT, color: NAVY, size: 22, bold: true })],
  });

const bullet = (runs, level = 0) =>
  new Paragraph({
    numbering: { reference: 'pinq-bullets', level },
    spacing: { after: 90, line: 276 },
    children: Array.isArray(runs) ? runs : [t(runs)],
  });

const numItem = (runs) =>
  new Paragraph({
    numbering: { reference: 'pinq-numbers', level: 0 },
    spacing: { after: 110, line: 276 },
    children: Array.isArray(runs) ? runs : [t(runs)],
  });

// magenta placeholder run
const ph = (text) => new TextRun({ text, font: FONT, color: MAGENTA, size: 21, bold: true });

const rule = (space = 160) =>
  new Paragraph({
    spacing: { before: space, after: space },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: MAGENTA, space: 1 } },
    children: [t('')],
  });

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const HAIR = { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9' };

function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const scaled = widths.map((w) => Math.round((w / total) * CONTENT_W));
  // fix rounding drift
  scaled[scaled.length - 1] += CONTENT_W - scaled.reduce((a, b) => a + b, 0);

  const headRow = new TableRow({
    tableHeader: true,
    children: headers.map((hd, i) => new TableCell({
      width: { size: scaled[i], type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' },
      margins: { top: 90, bottom: 90, left: 130, right: 130 },
      children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: hd, font: FONT, color: 'FFFFFF', size: 20, bold: true })] })],
    })),
  });

  const bodyRows = rows.map((r, ri) => new TableRow({
    children: r.map((cell, i) => new TableCell({
      width: { size: scaled[i], type: WidthType.DXA },
      shading: ri % 2 === 1 ? { type: ShadingType.CLEAR, fill: 'F4F5F7', color: 'auto' } : undefined,
      margins: { top: 90, bottom: 90, left: 130, right: 130 },
      children: (Array.isArray(cell) ? cell : [cell]).map((c) =>
        new Paragraph({
          spacing: { after: 0, line: 264 },
          children: typeof c === 'string' ? [t(c, { size: 20 })] : c,
        })),
    })),
  }));

  return new Table({
    columnWidths: scaled,
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: { top: HAIR, bottom: HAIR, left: HAIR, right: HAIR, insideHorizontal: HAIR, insideVertical: HAIR },
    rows: [headRow, ...bodyRows],
  });
}

// callout box: magenta left border, light fill
function callout(title, bodyParas) {
  return new Table({
    columnWidths: [CONTENT_W],
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, right: NO_BORDER,
      left: { style: BorderStyle.SINGLE, size: 24, color: MAGENTA },
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: 'FBF0F4', color: 'auto' },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: title, font: FONT, color: NAVY, size: 22, bold: true })] }),
          ...bodyParas,
        ],
      })],
    })],
  });
}

// ---------- header / footer ----------
const logo = new ImageRun({
  type: 'png',
  data: fs.readFileSync(ASSETS + 'pinq-care-logo.png'),
  transformation: { width: 106, height: 40 },
});

const docHeader = new Header({
  children: [
    new Paragraph({
      spacing: { after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: MAGENTA, space: 6 } },
      children: [logo],
    }),
  ],
});

const FOOT_COLS = ['Doc Number', 'Version', 'Page', 'Document Owner', 'Status', 'Date Created', 'Authorised By', 'Reviewed On'];
const FOOT_W = [110, 80, 100, 150, 100, 130, 130, 120];
const footTotal = FOOT_W.reduce((a, b) => a + b, 0);
const footScaled = FOOT_W.map((w) => Math.round((w / footTotal) * CONTENT_W));
footScaled[footScaled.length - 1] += CONTENT_W - footScaled.reduce((a, b) => a + b, 0);

const footCell = (children, i, head) => new TableCell({
  width: { size: footScaled[i], type: WidthType.DXA },
  shading: head ? { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' } : undefined,
  margins: { top: 50, bottom: 50, left: 70, right: 70 },
  children: [new Paragraph({ spacing: { after: 0 }, children })],
});

const docFooter = new Footer({
  children: [
    new Table({
      columnWidths: footScaled,
      width: { size: CONTENT_W, type: WidthType.DXA },
      borders: { top: HAIR, bottom: HAIR, left: HAIR, right: HAIR, insideHorizontal: HAIR, insideVertical: HAIR },
      rows: [
        new TableRow({
          tableHeader: true,
          children: FOOT_COLS.map((c, i) => footCell([new TextRun({ text: c, font: FONT, color: 'FFFFFF', size: 13, bold: true })], i, true)),
        }),
        new TableRow({
          children: [
            [new TextRun({ text: '', font: FONT, size: 13, color: BODY })],
            [new TextRun({ text: '1.0', font: FONT, size: 13, color: BODY })],
            [
              new TextRun({ font: FONT, size: 13, color: BODY, children: [PageNumber.CURRENT] }),
              new TextRun({ text: ' of ', font: FONT, size: 13, color: BODY }),
              new TextRun({ font: FONT, size: 13, color: BODY, children: [PageNumber.TOTAL_PAGES] }),
            ],
            [new TextRun({ text: '', font: FONT, size: 13, color: BODY })],
            [new TextRun({ text: 'Draft', font: FONT, size: 13, color: BODY })],
            [new TextRun({ text: '7 August 2026', font: FONT, size: 13, color: BODY })],
            [new TextRun({ text: '', font: FONT, size: 13, color: BODY })],
            [new TextRun({ text: '', font: FONT, size: 13, color: BODY })],
          ].map((c, i) => footCell(c, i, false)),
        }),
      ],
    }),
  ],
});

// ---------- content ----------
const children = [];

children.push(h1('Care About Referrals'));
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'Intake process — shared inbox and diary transfer', font: FONT, color: MAGENTA, size: 24, bold: true })],
}));
children.push(new Paragraph({
  spacing: { after: 0 },
  children: [t('Prepared for Charlotte, Intake  |  Effective from ', { size: 19, color: '595959' }), ph('[start date]'), t('  |  Status: Draft', { size: 19, color: '595959' })],
}));
children.push(rule(200));

// 1
children.push(h2('1. What this covers'));
children.push(p('Care About is a new referral partner in aged care. They send us clients who need allied health, and from this month those referrals come into a dedicated shared inbox rather than through the usual intake channels.'));
children.push(p([
  t('The inbox is '),
  new TextRun({ text: 'carepartners@physioinq.com.au', font: FONT, color: MAGENTA, size: 21, bold: true }),
  t('. Charlotte has access to the inbox and to its calendar. This document sets out what arrives there, what she does with it, and how fast.'),
]));

// 2
children.push(h2('2. Why this one works differently'));
children.push(p('Most referrals reach us before anyone has agreed a time — we take the referral, then we book it. Care About runs the other way around.'));
children.push(p('Jahari and Tom have given Care About their availability. Care About books the appointment with the client directly, off that availability, and then sends it to us. So by the time the referral lands in the carepartners inbox, a real client has already been told a real time.'));
children.push(callout('The risk this creates', [
  p('The appointment exists for the client, but it does not exist in Jahari or Tom\'s own diary until Charlotte puts it there. Anyone booking off their calendar in the meantime sees a free slot and takes it — and now two people are expecting the same clinician at the same time.', { after: 0 }),
]));
children.push(p('Moving the booking across quickly is the whole point of the process. Everything else in this document is ordinary intake work.', { before: 160 }));

// 3
children.push(h2('3. What arrives, and where'));
children.push(p('Two items come through for each referral, both to the carepartners inbox:'));
children.push(bullet([t('A ', {}), t('calendar invitation', { bold: true }), t(' for the appointment, with the referral information attached to it')]));
children.push(bullet([t('A ', {}), t('separate email', { bold: true }), t(' carrying the same referral information')]));
children.push(p('Work from the invitation. It carries the date, time and clinician, and it is what needs to end up in the diary. The email is the backup — if the attachment on the invitation is missing, corrupted or won\'t open, the detail should be sitting in the email instead.'));
children.push(p('If the two disagree on anything that matters — a different time, a different clinician, a different client — don\'t pick one. Go back to Care About and get it confirmed before the appointment goes into a diary.'));

// 4
children.push(h2('4. The one-hour rule'));
children.push(callout('Standard', [
  p([
    t('Every Care About appointment must be sitting in Jahari\'s or Tom\'s own diary '),
    new TextRun({ text: 'within one hour', font: FONT, color: NAVY, size: 21, bold: true }),
    t(' of arriving in the carepartners inbox, during business hours.'),
  ], { after: 0 }),
]));
children.push(p('One hour is tight on purpose. It is the window in which a double booking can happen, so the shorter it is, the smaller the problem.', { before: 160 }));
children.push(h3('Making it workable'));
children.push(bullet('Keep the carepartners inbox and calendar pinned open alongside the usual intake inbox, not tucked away in a folder that gets checked at intervals.'));
children.push(bullet('Turn on a desktop and mobile alert for new mail in that inbox so a referral doesn\'t sit unseen.'));
children.push(bullet([t('If Charlotte will be away from her desk for more than an hour — leave, training, a long block of clinical admin — hand the inbox over to '), ph('[named backup]'), t(' for that period.')]));
children.push(bullet([t('Anything landing outside business hours is actioned by '), ph('[time, e.g. 9:30am]'), t(' the next business day. Care About should be told which hours we monitor.')]));

// 5
children.push(h2('5. Step by step'));
children.push(numItem([t('Open the invitation ', { bold: true }), t('in the carepartners inbox and note the clinician, date and time.')]));
children.push(numItem([t('Open the attached referral ', { bold: true }), t('and check it has what we need: client name and date of birth, contact details, service address, referral reason, funding arrangement, and any access or safety notes.')]));
children.push(numItem([t('Cross-check the email ', { bold: true }), t('against the invitation. Same client, same time, same clinician.')]));
children.push(numItem([t('Put the appointment in the clinician\'s diary. ', { bold: true }), t('Create the appointment in Jahari\'s or Tom\'s calendar as Charlotte would for any other referral, with the referral document attached to the calendar item so the clinician has it in front of them. Keep the original invitation in the shared calendar as the record from Care About — don\'t delete it.')]));
children.push(numItem([t('Tell the clinician. ', { bold: true }), t('A short message — client name, time, and that a Care About referral has landed. Their calendar may take a few minutes to refresh, and the point is to stop them agreeing to something else in that slot.')]));
children.push(numItem([t('Create the deal in HubSpot. ', { bold: true }), t('See section 6.')]));
children.push(numItem([t('Reply to Care About ', { bold: true }), t('confirming the appointment is accepted and booked. Flag anything missing in the same reply.')]));
children.push(numItem([t('Mark the inbox item as actioned ', { bold: true }), t('using '), ph('[agreed category or folder]'), t(' so anyone looking at the inbox can see what has and hasn\'t been dealt with.')]));
children.push(p('Steps 1 to 5 are the one-hour part. Steps 6 to 8 should follow straight after, and in any case the same day.', { before: 80 }));

// 6
children.push(h2('6. Creating the deal in HubSpot'));
children.push(p('There is no integration between Care About and HubSpot. Every deal is created manually.'));
children.push(table(
  ['Field', 'What to enter'],
  [
    ['Pipeline', 'Standard intake pipeline — the same one used for all other referrals'],
    ['Deal stage', [[t('Referral partner stage', { size: 20 })], [ph('[confirm exact stage name]')]]],
    ['Deal name', [[t('Must contain "Care About". Recommended format:', { size: 20 })], [new TextRun({ text: '[Client Name] – Care About – [Service]', font: FONT, color: NAVY, size: 20, bold: true })]]],
    ['Referral source', 'Care About'],
    ['Owner / clinician', 'Jahari or Tom, matching the diary booking'],
    ['Appointment date', 'The date and time booked by Care About'],
    ['Funding', 'As stated on the referral'],
  ],
  [130, 380],
));
children.push(p('Having "Care About" in the deal name is what lets us pull partner volume out of HubSpot while there\'s no API tag doing it for us. It matters for reporting, so it isn\'t optional.', { before: 160 }));
children.push(p([t('Attach the referral document to the deal record as well, so the file lives somewhere other than a calendar item.')]));

// 7
children.push(h2('7. When something isn\'t right'));
children.push(table(
  ['Situation', 'What to do'],
  [
    ['Referral information is missing or incomplete',
      'Book the appointment in first — protecting the slot comes ahead of a complete file. Then go back to Care About for the missing detail and note in HubSpot what is outstanding.'],
    ['The booked time is outside the availability Jahari or Tom gave',
      'Don\'t quietly move it. Contact the clinician, agree what\'s workable, then have Care About confirm the change with the client. Care About holds the client relationship for the booking.'],
    ['The slot is already taken in the clinician\'s diary',
      [[t('This is the failure the one-hour rule exists to prevent, so flag it. Speak to the clinician about which appointment can move, then work with Care About on a new time for the client. Let ', { size: 20 }), ph('[escalation contact]'), t(' know it happened.', { size: 20 })]]],
    ['Care About cancels or reschedules',
      'Update the clinician\'s diary, the shared calendar and the HubSpot deal. All three, every time — a stale diary entry is as bad as a missing one.'],
    ['The client contacts us directly',
      'Handle it as we would any client, and let Care About know if the appointment changes as a result.'],
    ['Anything unclear about scope, funding or suitability',
      [[t('Escalate to ', { size: 20 })], [ph('[escalation contact]')]]],
  ],
  [180, 420],
));

// 8
children.push(h2('8. Quick checklist'));
children.push(p('For each referral:', { after: 100 }));
children.push(bullet('Invitation opened and referral attachment read'));
children.push(bullet('Email cross-checked against the invitation'));
children.push(bullet('Appointment in Jahari\'s or Tom\'s diary, referral attached — inside the hour'));
children.push(bullet('Clinician told directly'));
children.push(bullet('HubSpot deal created, standard pipeline, referral partner stage, "Care About" in the name'));
children.push(bullet('Referral document attached to the deal'));
children.push(bullet('Care About replied to'));
children.push(bullet('Inbox item marked as actioned'));

// 9
children.push(h2('9. What changes later'));
children.push(p('We\'re exploring an API integration between Care About and HubSpot that would create the deal automatically. It isn\'t built and there\'s no date for it. Until it is, this manual process is the process — nothing here should be skipped in anticipation of the integration arriving.'));
children.push(p([t('Charlotte should keep a note of anything about this process that is slow, awkward or error-prone. That feedback shapes what the integration needs to do, and it\'s easier to capture now than to reconstruct later. Send it to '), ph('[process owner]'), t('.')]));

// 10
children.push(h2('10. Contacts'));
children.push(table(
  ['Role', 'Who', 'Contact'],
  [
    ['Intake — Care About referrals', 'Charlotte', ''],
    ['Treating clinicians', 'Jahari and Tom', ''],
    ['Care About — referral queries', [[ph('[name]')]], [[ph('[email / phone]')]]],
    ['Escalation', [[ph('[name]')]], ''],
    ['Process owner', [[ph('[name]')]], ''],
  ],
  [200, 180, 220],
));
children.push(rule(240));
children.push(p([t('Fields shown in magenta need confirming before this goes to Charlotte. Read alongside the Policy and Operations Manual and current intake procedures — this document covers the Care About channel only, and does not replace either.', { size: 18, italics: true, color: '595959' })], { after: 0 }));

// ---------- document ----------
const doc = new Document({
  creator: 'Pinq Care',
  title: 'Care About Referrals — Intake Process',
  description: 'Intake process for Care About aged care referrals via the carepartners shared inbox',
  styles: {
    default: {
      document: { run: { font: FONT, size: 21, color: BODY } },
    },
  },
  numbering: {
    config: [
      {
        reference: 'pinq-bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) } }, run: { color: MAGENTA, font: FONT } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.6), hanging: convertInchesToTwip(0.2) } }, run: { color: MAGENTA, font: FONT } } },
        ],
      },
      {
        reference: 'pinq-numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.25) } }, run: { color: MAGENTA, font: FONT, bold: true } } },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: convertInchesToTwip(1.1), bottom: convertInchesToTwip(1.0), left: convertInchesToTwip(1), right: convertInchesToTwip(1), header: convertInchesToTwip(0.4), footer: convertInchesToTwip(0.3) },
      },
    },
    headers: { default: docHeader },
    footers: { default: docFooter },
    children,
  }],
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(process.argv[2] || 'Care-About-Referrals-Intake-Process.docx', b);
  console.log('written');
});
