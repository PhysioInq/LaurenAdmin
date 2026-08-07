const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  Header, Footer, ImageRun, PageNumber, LevelFormat, convertInchesToTwip,
} = require('docx');

const NAVY = '003054';
const MAGENTA = 'D82460';
const BODY = '262626';
const FONT = 'Arial';
const ASSETS = '/root/.claude/skills/physio-inq-branding/assets/';

// A4 content width: 11906 dxa page - 2 x 1in margins
const CONTENT_W = 11906 - convertInchesToTwip(1) * 2;

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

const bullet = (runs, level = 0) =>
  new Paragraph({
    numbering: { reference: 'pinq-bullets', level },
    spacing: { after: 90, line: 276 },
    children: Array.isArray(runs) ? runs : [t(runs)],
  });

const numItem = (runs, ref = 'pinq-numbers-a') =>
  new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 110, line: 276 },
    children: Array.isArray(runs) ? runs : [t(runs)],
  });

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

// callout box: coloured left border, tinted fill
function callout(title, bodyParas, tone = 'magenta') {
  const edge = tone === 'magenta' ? MAGENTA : NAVY;
  const fill = tone === 'magenta' ? 'FBF0F4' : 'EEF2F6';
  return new Table({
    columnWidths: [CONTENT_W],
    width: { size: CONTENT_W, type: WidthType.DXA },
    borders: {
      top: NO_BORDER, bottom: NO_BORDER, right: NO_BORDER,
      left: { style: BorderStyle.SINGLE, size: 24, color: edge },
      insideHorizontal: NO_BORDER, insideVertical: NO_BORDER,
    },
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill, color: 'auto' },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        children: [
          ...(title ? [new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: title, font: FONT, color: NAVY, size: 22, bold: true })] })] : []),
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
  children: [t('Prepared for Charlotte, Intake  |  Status: Draft', { size: 19, color: '595959' })],
}));
children.push(rule(200));

// 1
children.push(h2('1. What this covers'));
children.push(p('Care About is a new referral partner in aged care. Clients contact Care About directly looking for a support at home provider. Care About then selects a provider from their partners — Pinq Care among them — based on location, availability and suitability.'));
children.push(p('They only select one provider to refer to. Once they have qualified the client, they book that client straight into the Care Partner\'s diary. These are clients who already have an active aged care package.'));
children.push(p([
  t('We can\'t sync the Care Partner diaries with Care About, so we have a manual work-around. Referrals come into a new inbox, '),
  new TextRun({ text: 'carepartners@physioinq.com.au', font: FONT, color: MAGENTA, size: 21, bold: true }),
  t('. Charlotte, Allisa, Robyn, Lauren, Tom and Jahari all have access to the inbox and to its calendar. This document sets out what happens when referrals land there.'),
]));

// 2
children.push(h2('2. Why this one works differently'));
children.push(p('Jahari and Tom have given Care About their availability. Care About books the appointment with the client directly, off that availability, and then sends it to us. So by the time the referral lands in the carepartners inbox, a real client has already been told a real time.'));
children.push(callout('The risk this creates', [
  p('The appointment exists for the client, but it does not exist in Jahari or Tom\'s own diary until Charlotte puts it there. Both have the Care About availability blocked out in their own diaries, so the slot itself is protected — but referrals still need actioning promptly so nothing sits unnoticed.', { after: 0 }),
]));
children.push(p('Charlotte will need to:', { before: 200, after: 100 }));
children.push(numItem('Create the deal in HubSpot, based on the information in the Care About booking.', 'pinq-numbers-a'));
children.push(numItem('Book the same appointment in the Care Partner\'s diary.', 'pinq-numbers-a'));
children.push(callout('Note', [
  p('Charlotte does not need to contact the client. All intake and prescreening information is collected by Care About.', { after: 0 }),
], 'navy'));

// 3
children.push(h2('3. What arrives, and where'));
children.push(p('Two items come through for each referral, both to the carepartners inbox:'));
children.push(bullet([t('A '), t('calendar invitation', { bold: true }), t(' for the appointment, with the referral information attached to it')]));
children.push(bullet([t('A '), t('separate email', { bold: true }), t(' carrying the same referral information')]));
children.push(p('Work from the invitation. It carries the date, time and clinician, and it is what needs to end up in the diary. The email is the backup — if the attachment on the invitation is missing, corrupted or won\'t open, the detail should be sitting in the email instead.'));

// 4
children.push(h2('4. Step by step'));
children.push(numItem([t('Open the invitation ', { bold: true }), t('in the carepartners inbox and note the Care Partner, date and time.')], 'pinq-numbers-b'));
children.push(numItem([t('Open the attached referral ', { bold: true }), t('and check it has what we need: client name and date of birth, contact details, service address, referral reason, funding arrangement, and any access or safety notes.')], 'pinq-numbers-b'));
children.push(numItem([t('Create the deal in HubSpot ', { bold: true }), t('in the referral partner deal stage, noting Care About in the deal name.')], 'pinq-numbers-b'));
children.push(numItem([t('Put the appointment in the clinician\'s diary. ', { bold: true }), t('Create the appointment in Jahari\'s or Tom\'s calendar as Charlotte would for any other referral, with the referral document attached to the calendar item so the clinician has it in front of them. Keep the original invitation in the shared calendar as the record from Care About — don\'t delete it.')], 'pinq-numbers-b'));
children.push(numItem([t('Tell the clinician. ', { bold: true }), t('A short message — client name, time, and that a Care About referral has landed. Their calendar may take a few minutes to refresh, and the point is to stop them agreeing to something else in that slot.')], 'pinq-numbers-b'));
children.push(numItem([t('Reply to Care About ', { bold: true }), t('confirming the appointment is accepted and booked. Flag anything missing in the same reply.')], 'pinq-numbers-b'));
children.push(callout('Orange referral checks', [
  p('Occasionally a referral comes through with a more complex presentation, specific requirements, or a location slightly outside our zone. Care About will send the referral information to the carepartners inbox and ask us to accept or reject it before sending it through. Check these with the Care Partner or Robyn before accepting.', { after: 0 }),
], 'navy'));

// 5
children.push(h2('5. Creating the deal in HubSpot'));
children.push(p('There is no integration between Care About and HubSpot. Every deal is created manually. We\'re exploring an API integration to streamline this in future.'));
children.push(table(
  ['Field', 'What to enter'],
  [
    ['Pipeline', 'CAREINQ'],
    ['Deal stage', 'Referral partner stage'],
    ['Deal name', 'Must contain "Care About"'],
    ['Referral source', 'Care About'],
    ['Owner / clinician', 'Jahari or Tom, matching the diary booking'],
    ['Appointment date', 'The date and time booked by Care About'],
  ],
  [130, 380],
));

// 6
children.push(h2('6. When something isn\'t right'));
children.push(table(
  ['Situation', 'What to do'],
  [
    ['Referral information is missing or incomplete',
      'Book the appointment in first — protecting the slot comes ahead of a complete file. Then go back to Care About for the missing detail and note in HubSpot what is outstanding.'],
    ['The booked time is outside the availability Jahari or Tom gave',
      'Don\'t quietly move it. Contact the clinician, agree what\'s workable, then have Care About confirm the change with the client. Care About holds the client relationship for the booking.'],
    ['The slot is already taken in the clinician\'s diary',
      'Speak to the Care Partner. Tom is prepared to move existing Physio Inq clients around as needed.'],
    ['Care About cancels or reschedules',
      'Update the clinician\'s diary, the shared calendar and the HubSpot deal.'],
    ['The client contacts us directly',
      'Handle it as we would any client, and let Care About know if the appointment changes as a result.'],
    ['Anything unclear about scope, funding or suitability',
      'Escalate to Robyn.'],
  ],
  [180, 420],
));

// 7
children.push(h2('7. Quick checklist'));
children.push(p('For each referral:', { after: 100 }));
children.push(bullet('Invitation opened and referral attachment read'));
children.push(bullet('HubSpot deal created, referral partner stage, "Care About" in the name'));
children.push(bullet('Referral document attached to the deal'));
children.push(bullet('Appointment in Jahari\'s or Tom\'s diary'));
children.push(bullet('Care Partner told directly'));
children.push(bullet('Inbox item marked as actioned'));

// 8
children.push(h2('8. After the Care About meeting'));
children.push(p('The Care Partner is responsible for updating the Care About portal with short notes about the meeting, and for following up with the client.'));

// 9
children.push(h2('9. Volume'));
children.push(p('We\'ve asked Care About to start with 15 referrals a month — 10 in NSW and 5 in SA — so volume should stay manageable while we bed this process down.'));

children.push(rule(240));
children.push(p([t('Read alongside the Policy and Operations Manual and current intake procedures. This document covers the Care About channel only and does not replace either.', { size: 18, italics: true, color: '595959' })], { after: 0 }));

// ---------- document ----------
const decimalLevel = () => ([
  { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.25) } }, run: { color: MAGENTA, font: FONT, bold: true } } },
]);

const doc = new Document({
  creator: 'Pinq Care',
  title: 'Care About Referrals — Intake Process',
  description: 'Intake process for Care About aged care referrals via the carepartners shared inbox',
  styles: { default: { document: { run: { font: FONT, size: 21, color: BODY } } } },
  numbering: {
    config: [
      {
        reference: 'pinq-bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) } }, run: { color: MAGENTA, font: FONT } } },
        ],
      },
      { reference: 'pinq-numbers-a', levels: decimalLevel() },
      { reference: 'pinq-numbers-b', levels: decimalLevel() },
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
