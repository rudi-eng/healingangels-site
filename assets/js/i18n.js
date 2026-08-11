/* Healing Angels — internationalization
   Languages: English (en), Deutsch (de), Türkçe (tr), فارسی (fa)
   English is the default. Choice is stored in localStorage.ha_lang
*/
(function () {
  "use strict";

  var LANGS = [
    { code: "en", label: "English", native: "English", dir: "ltr", locale: "en-GB" },
    { code: "de", label: "German",  native: "Deutsch", dir: "ltr", locale: "de-DE" },
    { code: "tr", label: "Turkish", native: "Türkçe",  dir: "ltr", locale: "tr-TR" },
    { code: "fa", label: "Persian", native: "فارسی",   dir: "rtl", locale: "fa-IR" }
  ];

  var T = {
    /* ========== ENGLISH ========== */
    en: {
      /* meta */
      "meta.title.home": "Healing Angels — How cats and dogs heal us, one prayer at a time",
      "meta.desc.home": "Healing Angels is a prayerful community about how cats and dogs heal us, and how we heal them in return. Friends of Caycuma supports rescue, adoption and care for cats and dogs.",
      "meta.title.members": "Members & Therapy Stories | Healing Angels",
      "meta.desc.members": "The members of Healing Angels and their therapy stories — how a cat or dog helped them heal. Share your own story and join.",
      "meta.title.blog": "Journal | Healing Angels",
      "meta.desc.blog": "Notes, prayers and quiet stories from Healing Angels.",
      "meta.title.club": "Friends of Caycuma — donate, volunteer, adopt | Healing Angels",
      "meta.desc.club": "Friends of Caycuma: a small community feeding, healing and rehoming street cats and dogs in Caycuma. Donate food, volunteer your time, adopt or list a pet.",
      "meta.title.post": "Post | Healing Angels",

      /* brand & nav */
      "brand.tag": "Prayer · Cats · Healing",
      "nav.home": "Home",
      "nav.members": "Members",
      "nav.blog": "Blog",
      "nav.club": "Friends of Caycuma",
      "nav.owner": "Owner",
      "nav.open": "Open menu",
      "nav.close": "Close menu",
      "lang.label": "Language",

      /* footer */
      "footer.tagline": "A prayerful community about how cats and dogs heal us — and how we heal them in return.",
      "footer.explore": "Explore",
      "footer.takePart": "Take part",
      "footer.owner": "Owner",
      "footer.ownerLogin": "Owner login",
      "footer.contact": "Contact",
      "footer.becomeMember": "Become a member",
      "footer.donate": "Donate",
      "footer.volunteer": "Volunteer",
      "footer.adopt": "Adopt",
      "footer.made": "made with quiet prayers",
      "footer.copy": "Healing Angels · Friends of Caycuma",

      /* home hero */
      "home.eyebrow": "Prayerful community",
      "home.h1.a": "How a small ",
      "home.h1.b": "angel with paws",
      "home.h1.c": " heals the human heart.",
      "home.lede": "Healing Angels is a quiet, prayerful corner of the world devoted to the cats and dogs who carry grace on their small shoulders — and to the people who love them back.",
      "home.cta.insight": "Today's Insight",
      "home.cta.members": "Meet the members",
      "home.cta.club": "Friends of Caycuma",
      "home.hero.caption": "~ a friend, a prayer, a purr ~",
      "home.badge.title": "Friends of Caycuma",
      "home.badge.sub": "rescue · adopt · pray",

      /* insight */
      "insight.eyebrow": "Insight of the Day",
      "insight.h2": "A word from the book",
      "insight.p": "Each day a phrase from the book is offered — with a short prayer and a moment to breathe. The owner writes it fresh every morning.",
      "insight.prayerLabel": "A short prayer",
      "insight.loading": "Loading today's insight…",
      "insight.fallback.excerpt": "Today's insight will appear here once the owner writes it.",
      "insight.fallback.prayer": "A short prayer will follow.",
      "insight.empty.excerpt": "Today's word is being written. Please come back in a moment.",

      /* therapy */
      "therapy.eyebrow": "Therapy Session",
      "therapy.h2": "Stories of healing",
      "therapy.p": "Paws that listened. Whiskers that comforted. Members of Healing Angels share how a cat or dog helped them through.",
      "therapy.seeAll": "See all members & share your story",
      "therapy.loading": "Loading stories…",
      "therapy.empty": "No stories yet — be the first to share yours.",
      "therapy.error": "Stories will appear here once members share theirs.",

      /* caycuma home */
      "caycuma.eyebrow": "Friends of Caycuma",
      "caycuma.h2": "Help us feed, heal and home the small angels",
      "caycuma.p": "A small community in Caycuma caring for street cats and dogs. Donate food, give your time, adopt, or list a pet that needs a home.",
      "caycuma.donate.h3": "Donate food",
      "caycuma.donate.p": "Every small gift buys bowls of food and a warm blanket for a street cat or dog in Caycuma.",
      "caycuma.donate.a": "Give food →",
      "caycuma.volunteer.h3": "Volunteer",
      "caycuma.volunteer.p": "Give an hour of your time. Feed, walk, foster, or simply sit with a shy rescue until it learns to trust again.",
      "caycuma.volunteer.a": "Offer your time →",
      "caycuma.adopt.h3": "Adopt",
      "caycuma.adopt.p": "Open your home and your heart. Meet cats and dogs in Caycuma waiting for someone to call their own.",
      "caycuma.adopt.a": "See who's waiting →",
      "caycuma.list.h3": "List a pet",
      "caycuma.list.p": "Know a cat or dog that needs a home? Add it here and our community will help spread the word.",
      "caycuma.list.a": "List a pet →",

      /* blog home */
      "blog.eyebrow": "From the journal",
      "blog.h2": "Notes from Healing Angels",
      "blog.p": "Reflections, prayer notes and quiet stories from the owner — written most days.",
      "blog.readJournal": "Read the journal →",
      "blog.loading": "Loading posts…",
      "blog.empty": "No journal entries yet — the owner is preparing the first one.",
      "blog.error": "Journal entries will appear here soon.",
      "blog.read": "Read →",

      /* cta */
      "cta.h2": "Will you walk with us?",
      "cta.p": "You don't have to be a writer or have a story. You only have to love a small creature and want it well. Join us — and bring a quiet prayer with you.",
      "cta.member": "Become a member",
      "cta.donate": "Donate to Caycuma",

      /* members page */
      "members.eyebrow": "Therapy Session · Members",
      "members.h2": "Stories of being healed by an angel with paws",
      "members.p": "Every member of Healing Angels has a story. Some are quiet, some are big — all of them are true. Below are the people who chose to share theirs.",
      "members.loading": "Loading members…",
      "members.empty": "No members yet — be the first to share your story below.",
      "members.error": "Members will appear here soon.",
      "members.contact": "Contact:",
      "join.eyebrow": "Become a member",
      "join.h2": "Share your story",
      "join.p": "Membership is free and gentle. Tell us about you and your cat or dog. The owner will read your story and, once approved, it will appear in the Therapy Session gallery above.",
      "join.name": "Your name",
      "join.location": "City / town",
      "join.pet": "Pet's name",
      "join.species": "Species",
      "join.species.cat": "Cat",
      "join.species.dog": "Dog",
      "join.species.other": "Other",
      "join.breed": "Breed / description",
      "join.breed.ph": "e.g. tabby, golden retriever",
      "join.photo": "Photo URL (optional)",
      "join.photo.ph": "https://… (owner can add a photo for you later)",
      "join.story": "Your therapy story",
      "join.story.ph": "How did your cat or dog help you through something? A few sentences are enough. You can write more if you wish.",
      "join.badges": "Badges (optional)",
      "join.badge.donated": "I have donated to Friends of Caycuma",
      "join.badge.adopter": "I have adopted a cat or dog",
      "join.badge.volunteer": "I volunteer with animals",
      "join.contact": "Public contact (optional — only shown if you fill this in)",
      "join.contact.ph": "email, website, or social handle",
      "join.submit": "Send my story",
      "join.sending": "Sending…",
      "join.note": "Your story is held for the owner's approval before it appears. Thank you for trusting us with it.",
      "join.ok": "Thank you — your story has been sent. The owner will read it and approve it soon.",
      "join.err": "Sorry, something went wrong.",

      /* blog page */
      "blogpage.eyebrow": "Journal",
      "blogpage.h2": "Notes from Healing Angels",
      "blogpage.p": "Reflections, prayer notes and quiet stories written by the owner — most days, when the cats allow it.",

      /* club page */
      "club.eyebrow": "Friends of Caycuma",
      "club.h2": "For the small angels with no home — yet",
      "club.p": "Caycuma is a small town with a big heart and many street cats and dogs. Friends of Caycuma is the practical arm of Healing Angels: food, foster, and forever homes.",
      "donate.eyebrow": "Donate",
      "donate.h2": "A bowl of food, a warm night",
      "donate.p1": "Every gift — large or small — buys food, medicine and shelter for a cat or dog in Caycuma. Cats and dogs are both cared for here; no one is left out.",
      "donate.p2": "Donations are handled securely. You can give once or set up a small monthly gift that quietly keeps a rescue fed.",
      "donate.10": "Give €10",
      "donate.25": "Give €25",
      "donate.50": "Give €50",
      "donate.custom": "Custom",
      "donate.note": "All donations go directly to cat & dog food, vet care, and warm bedding in Caycuma.",
      "donate.setup": "Donation link is being set up by the owner. To give now, please email hello@healingangels.site — thank you.",
      "donate.how": "How your gift helps",
      "donate.item10": "€10 — a week of kibble for one street cat",
      "donate.item25": "€25 — a vet check + flea treatment for a dog",
      "donate.item50": "€50 — neuter a cat or dog, helping the whole colony",
      "donate.item100": "€100 — emergency surgery contribution",
      "vol.eyebrow": "Volunteer",
      "vol.h2": "Give your time",
      "vol.p": "Even one hour helps. Feed, walk, foster, transport, or simply sit with a shy rescue until it trusts again.",
      "vol.name": "Your name",
      "vol.email": "Email",
      "vol.city": "City / town",
      "vol.role": "How would you like to help?",
      "vol.role.feed": "Feeding street cats",
      "vol.role.walk": "Walking rescue dogs",
      "vol.role.foster": "Fostering temporarily",
      "vol.role.transport": "Transport to the vet",
      "vol.role.visit": "Visiting shy rescues",
      "vol.role.other": "Something else",
      "vol.avail": "When are you usually free?",
      "vol.avail.ph": "e.g. weekday evenings, weekends",
      "vol.msg": "Anything you'd like us to know?",
      "vol.msg.ph": "A short note about you, your experience with animals, or which animals you'd most like to help.",
      "vol.submit": "Offer your time",
      "vol.sending": "Sending…",
      "vol.note": "The owner will receive your offer and reply to you by email.",
      "vol.ok": "Thank you — your offer has been sent. The owner will reply by email.",
      "vol.err": "Sorry, something went wrong.",
      "adopt.eyebrow": "Adopt",
      "adopt.h2": "Who is waiting for a home?",
      "adopt.p": "Cats and dogs currently in Caycuma looking for a family. Tap a card to apply — the owner will walk you through the process.",
      "adopt.loading": "Loading adoptable pets…",
      "adopt.empty": "No pets are listed for adoption right now. Please check back soon — or list one yourself below.",
      "adopt.error": "Adoptable pets will appear here soon.",
      "adopt.apply": "To apply:",
      "adopt.contactOwner": "contact the owner",
      "list.eyebrow": "List a pet",
      "list.h2": "Know a cat or dog that needs a home?",
      "list.p": "Tell us about a pet that needs adoption. The owner will review your submission and, once approved, it will appear above in the Adopt section.",
      "list.petName": "Pet name",
      "list.petName.ph": "e.g. Mochi",
      "list.species": "Species",
      "list.age": "Age (approx.)",
      "list.age.ph": "e.g. 2 years, tabby",
      "list.photo": "Photo URL (optional)",
      "list.photo.ph": "https://… (owner can add later)",
      "list.body": "Tell us about this pet",
      "list.body.ph": "The pet's story, temperament, where it is, and how to contact the carer.",
      "list.contact": "Your contact (for the adopter)",
      "list.contact.ph": "email or phone",
      "list.submitter": "Your name",
      "list.submit": "Submit for review",
      "list.submitting": "Submitting…",
      "list.note": "Your submission is held for the owner's approval before it appears publicly.",
      "list.ok": "Thank you — your pet has been submitted for the owner's review.",
      "list.err": "Sorry, something went wrong.",

      /* post */
      "post.back": "← Back to journal",
      "post.loading": "Loading the post…",
      "post.none": "No post was specified.",
      "post.notFound": "This post could not be found.",
      "post.error": "This post could not be loaded.",

      /* shared dynamic */
      "badge.donated": "donated",
      "badge.adopter": "adopter",
      "badge.volunteer": "volunteer",
      "and": "and",
      "theirAngel": "their angel"
    },

    /* ========== DEUTSCH ========== */
    de: {
      "meta.title.home": "Healing Angels — Wie Katzen und Hunde uns heilen, Gebet für Gebet",
      "meta.desc.home": "Healing Angels ist eine betende Gemeinschaft darüber, wie Katzen und Hunde uns heilen — und wie wir sie im Gegenzug heilen. Freunde von Caycuma unterstützen Rettung, Adoption und Pflege.",
      "meta.title.members": "Mitglieder & Therapigeschichten | Healing Angels",
      "meta.desc.members": "Die Mitglieder von Healing Angels und ihre Therapigeschichten — wie eine Katze oder ein Hund ihnen half, zu heilen. Teilen Sie Ihre Geschichte und werden Sie Mitglied.",
      "meta.title.blog": "Tagebuch | Healing Angels",
      "meta.desc.blog": "Notizen, Gebete und stille Geschichten von Healing Angels.",
      "meta.title.club": "Freunde von Caycuma — spenden, helfen, adoptieren | Healing Angels",
      "meta.desc.club": "Freunde von Caycuma: eine kleine Gemeinschaft, die Straßenkatzen und -hunde in Caycuma füttert, heilt und vermittelt. Futter spenden, Zeit geben, adoptieren oder ein Tier anbieten.",
      "meta.title.post": "Beitrag | Healing Angels",

      "brand.tag": "Gebet · Katzen · Heilung",
      "nav.home": "Start",
      "nav.members": "Mitglieder",
      "nav.blog": "Blog",
      "nav.club": "Freunde von Caycuma",
      "nav.owner": "Inhaber",
      "nav.open": "Menü öffnen",
      "nav.close": "Menü schließen",
      "lang.label": "Sprache",

      "footer.tagline": "Eine betende Gemeinschaft darüber, wie Katzen und Hunde uns heilen — und wie wir sie im Gegenzug heilen.",
      "footer.explore": "Entdecken",
      "footer.takePart": "Mitmachen",
      "footer.owner": "Inhaber",
      "footer.ownerLogin": "Inhaber-Anmeldung",
      "footer.contact": "Kontakt",
      "footer.becomeMember": "Mitglied werden",
      "footer.donate": "Spenden",
      "footer.volunteer": "Helfen",
      "footer.adopt": "Adoptieren",
      "footer.made": "gemacht mit stillen Gebeten",
      "footer.copy": "Healing Angels · Freunde von Caycuma",

      "home.eyebrow": "Betende Gemeinschaft",
      "home.h1.a": "Wie ein kleiner ",
      "home.h1.b": "Engel mit Pfoten",
      "home.h1.c": " das menschliche Herz heilt.",
      "home.lede": "Healing Angels ist eine stille, betende Ecke der Welt — den Katzen und Hunden gewidmet, die Gnade auf ihren kleinen Schultern tragen, und den Menschen, die sie zurücklieben.",
      "home.cta.insight": "Heutige Einsicht",
      "home.cta.members": "Mitglieder kennenlernen",
      "home.cta.club": "Freunde von Caycuma",
      "home.hero.caption": "~ ein Freund, ein Gebet, ein Schnurren ~",
      "home.badge.title": "Freunde von Caycuma",
      "home.badge.sub": "retten · adoptieren · beten",

      "insight.eyebrow": "Einsicht des Tages",
      "insight.h2": "Ein Wort aus dem Buch",
      "insight.p": "Jeden Tag wird eine Zeile aus dem Buch angeboten — mit einem kurzen Gebet und einem Moment zum Atmen. Der Inhaber schreibt sie jeden Morgen neu.",
      "insight.prayerLabel": "Ein kurzes Gebet",
      "insight.loading": "Heutige Einsicht wird geladen…",
      "insight.fallback.excerpt": "Die heutige Einsicht erscheint hier, sobald der Inhaber sie schreibt.",
      "insight.fallback.prayer": "Ein kurzes Gebet folgt.",
      "insight.empty.excerpt": "Das heutige Wort wird gerade geschrieben. Bitte kommen Sie gleich wieder.",

      "therapy.eyebrow": "Therapiestunde",
      "therapy.h2": "Geschichten der Heilung",
      "therapy.p": "Pfoten, die zuhörten. Schnurrhaare, die trösteten. Mitglieder von Healing Angels erzählen, wie eine Katze oder ein Hund ihnen half.",
      "therapy.seeAll": "Alle Mitglieder sehen & Ihre Geschichte teilen",
      "therapy.loading": "Geschichten werden geladen…",
      "therapy.empty": "Noch keine Geschichten — seien Sie die Erste oder der Erste, die oder der teilt.",
      "therapy.error": "Geschichten erscheinen hier, sobald Mitglieder sie teilen.",

      "caycuma.eyebrow": "Freunde von Caycuma",
      "caycuma.h2": "Helfen Sie uns, die kleinen Engel zu füttern, zu heilen und zu vermitteln",
      "caycuma.p": "Eine kleine Gemeinschaft in Caycuma kümmert sich um Straßenkatzen und -hunde. Spenden Sie Futter, geben Sie Zeit, adoptieren Sie, oder melden Sie ein Tier, das ein Zuhause braucht.",
      "caycuma.donate.h3": "Futter spenden",
      "caycuma.donate.p": "Jedes kleine Geschenk kauft Näpfe voll Futter und eine warme Decke für eine Straßenkatze oder einen Straßenhund in Caycuma.",
      "caycuma.donate.a": "Futter geben →",
      "caycuma.volunteer.h3": "Freiwillig helfen",
      "caycuma.volunteer.p": "Schenken Sie eine Stunde. Füttern, spazieren, pflegen, oder einfach bei einem scheuen Retter sitzen, bis es wieder vertraut.",
      "caycuma.volunteer.a": "Ihre Zeit anbieten →",
      "caycuma.adopt.h3": "Adoptieren",
      "caycuma.adopt.p": "Öffnen Sie Ihr Zuhause und Ihr Herz. Lernen Sie Katzen und Hunde in Caycuma kennen, die auf jemanden warten.",
      "caycuma.adopt.a": "Wer wartet? →",
      "caycuma.list.h3": "Tier anbieten",
      "caycuma.list.p": "Kennen Sie eine Katze oder einen Hund, die oder der ein Zuhause braucht? Tragen Sie sie hier ein — unsere Gemeinschaft hilft, das Wort zu verbreiten.",
      "caycuma.list.a": "Tier anbieten →",

      "blog.eyebrow": "Aus dem Tagebuch",
      "blog.h2": "Notizen von Healing Angels",
      "blog.p": "Reflexionen, Gebetsnotizen und stille Geschichten des Inhabers — an den meisten Tagen.",
      "blog.readJournal": "Das Tagebuch lesen →",
      "blog.loading": "Beiträge werden geladen…",
      "blog.empty": "Noch keine Tagebucheinträge — der Inhaber bereitet den ersten vor.",
      "blog.error": "Tagebucheinträge erscheinen hier bald.",
      "blog.read": "Lesen →",

      "cta.h2": "Gehen Sie mit uns?",
      "cta.p": "Sie müssen weder schreiben noch eine Geschichte haben. Sie müssen nur ein kleines Wesen lieben und ihm Gutes wünschen. Kommen Sie zu uns — und bringen Sie ein stilles Gebet mit.",
      "cta.member": "Mitglied werden",
      "cta.donate": "An Caycuma spenden",

      "members.eyebrow": "Therapiestunde · Mitglieder",
      "members.h2": "Geschichten von der Heilung durch einen Engel mit Pfoten",
      "members.p": "Jedes Mitglied von Healing Angels hat eine Geschichte. Manche sind leise, manche groß — alle sind wahr. Unten die Menschen, die sich entschieden haben zu teilen.",
      "members.loading": "Mitglieder werden geladen…",
      "members.empty": "Noch keine Mitglieder — teilen Sie unten als Erste oder Erster Ihre Geschichte.",
      "members.error": "Mitglieder erscheinen hier bald.",
      "members.contact": "Kontakt:",
      "join.eyebrow": "Mitglied werden",
      "join.h2": "Teilen Sie Ihre Geschichte",
      "join.p": "Die Mitgliedschaft ist kostenlos und behutsam. Erzählen Sie von sich und Ihrer Katze oder Ihrem Hund. Der Inhaber liest Ihre Geschichte und veröffentlicht sie nach Freigabe in der Galerie oben.",
      "join.name": "Ihr Name",
      "join.location": "Stadt / Ort",
      "join.pet": "Name des Tieres",
      "join.species": "Art",
      "join.species.cat": "Katze",
      "join.species.dog": "Hund",
      "join.species.other": "Andere",
      "join.breed": "Rasse / Beschreibung",
      "join.breed.ph": "z. B. Tigerkatze, Golden Retriever",
      "join.photo": "Foto-URL (optional)",
      "join.photo.ph": "https://… (der Inhaber kann später ein Foto hinzufügen)",
      "join.story": "Ihre Therapigeschichte",
      "join.story.ph": "Wie hat Ihre Katze oder Ihr Hund Ihnen geholfen? Ein paar Sätze genügen. Sie dürfen mehr schreiben.",
      "join.badges": "Abzeichen (optional)",
      "join.badge.donated": "Ich habe an Freunde von Caycuma gespendet",
      "join.badge.adopter": "Ich habe eine Katze oder einen Hund adoptiert",
      "join.badge.volunteer": "Ich helfe ehrenamtlich bei Tieren",
      "join.contact": "Öffentlicher Kontakt (optional — nur sichtbar, wenn ausgefüllt)",
      "join.contact.ph": "E-Mail, Website oder Social-Handle",
      "join.submit": "Meine Geschichte senden",
      "join.sending": "Wird gesendet…",
      "join.note": "Ihre Geschichte wird erst nach Freigabe durch den Inhaber veröffentlicht. Danke für Ihr Vertrauen.",
      "join.ok": "Danke — Ihre Geschichte wurde gesendet. Der Inhaber liest und freigibt sie bald.",
      "join.err": "Entschuldigung, etwas ist schiefgelaufen.",

      "blogpage.eyebrow": "Tagebuch",
      "blogpage.h2": "Notizen von Healing Angels",
      "blogpage.p": "Reflexionen, Gebetsnotizen und stille Geschichten des Inhabers — an den meisten Tagen, wenn die Katzen es erlauben.",

      "club.eyebrow": "Freunde von Caycuma",
      "club.h2": "Für die kleinen Engel ohne Zuhause — noch",
      "club.p": "Caycuma ist eine kleine Stadt mit großem Herzen und vielen Straßenkatzen und -hunden. Freunde von Caycuma ist der praktische Arm von Healing Angels: Futter, Pflege und endgültige Zuhause.",
      "donate.eyebrow": "Spenden",
      "donate.h2": "Ein Napf Futter, eine warme Nacht",
      "donate.p1": "Jedes Geschenk — groß oder klein — kauft Futter, Medizin und Unterkunft für eine Katze oder einen Hund in Caycuma. Hier werden Katzen und Hunde gleichermaßen betreut; niemand wird ausgelassen.",
      "donate.p2": "Spenden werden sicher abgewickelt. Sie können einmalig geben oder eine kleine monatliche Gabe einrichten, die still einen Retter ernährt.",
      "donate.10": "€10 spenden",
      "donate.25": "€25 spenden",
      "donate.50": "€50 spenden",
      "donate.custom": "Eigener Betrag",
      "donate.note": "Alle Spenden fließen direkt in Katzen- und Hundefutter, Tierarztpflege und warmes Bettzeug in Caycuma.",
      "donate.setup": "Der Spendenlink wird vom Inhaber eingerichtet. Zum Geben jetzt bitte hello@healingangels.site schreiben — danke.",
      "donate.how": "Wie Ihre Gabe hilft",
      "donate.item10": "€10 — eine Woche Trockenfutter für eine Straßenkatze",
      "donate.item25": "€25 — Tierarztkontrolle + Flohbehandlung für einen Hund",
      "donate.item50": "€50 — Kastration einer Katze oder eines Hundes, zum Nutzen der ganzen Kolonie",
      "donate.item100": "€100 — Beitrag zu einer Notoperation",
      "vol.eyebrow": "Freiwillig helfen",
      "vol.h2": "Schenken Sie Ihre Zeit",
      "vol.p": "Schon eine Stunde hilft. Füttern, spazieren, pflegen, transportieren — oder einfach bei einem scheuen Retter sitzen, bis es vertraut.",
      "vol.name": "Ihr Name",
      "vol.email": "E-Mail",
      "vol.city": "Stadt / Ort",
      "vol.role": "Wie möchten Sie helfen?",
      "vol.role.feed": "Straßenkatzen füttern",
      "vol.role.walk": "Rettungshunde ausführen",
      "vol.role.foster": "Vorübergehend pflegen",
      "vol.role.transport": "Transport zum Tierarzt",
      "vol.role.visit": "Scheue Retter besuchen",
      "vol.role.other": "Etwas anderes",
      "vol.avail": "Wann sind Sie meist frei?",
      "vol.avail.ph": "z. B. Abende unter der Woche, Wochenenden",
      "vol.msg": "Möchten Sie uns etwas mitteilen?",
      "vol.msg.ph": "Eine kurze Notiz über Sie, Ihre Tiererfahrung oder welche Tiere Sie am liebsten unterstützen möchten.",
      "vol.submit": "Ihre Zeit anbieten",
      "vol.sending": "Wird gesendet…",
      "vol.note": "Der Inhaber erhält Ihr Angebot und antwortet per E-Mail.",
      "vol.ok": "Danke — Ihr Angebot wurde gesendet. Der Inhaber antwortet per E-Mail.",
      "vol.err": "Entschuldigung, etwas ist schiefgelaufen.",
      "adopt.eyebrow": "Adoptieren",
      "adopt.h2": "Wer wartet auf ein Zuhause?",
      "adopt.p": "Katzen und Hunde in Caycuma, die eine Familie suchen. Tippen Sie auf eine Karte, um sich zu bewerben — der Inhaber begleitet Sie durch den Prozess.",
      "adopt.loading": "Vermittelbare Tiere werden geladen…",
      "adopt.empty": "Derzeit sind keine Tiere zur Adoption gelistet. Schauen Sie bald wieder vorbei — oder melden Sie unten selbst eines.",
      "adopt.error": "Vermittelbare Tiere erscheinen hier bald.",
      "adopt.apply": "Zur Bewerbung:",
      "adopt.contactOwner": "den Inhaber kontaktieren",
      "list.eyebrow": "Tier anbieten",
      "list.h2": "Kennen Sie eine Katze oder einen Hund, die ein Zuhause brauchen?",
      "list.p": "Erzählen Sie uns von einem Tier, das adoptiert werden soll. Der Inhaber prüft Ihre Meldung und veröffentlicht sie nach Freigabe im Bereich Adoptieren.",
      "list.petName": "Name des Tieres",
      "list.petName.ph": "z. B. Mochi",
      "list.species": "Art",
      "list.age": "Alter (ca.)",
      "list.age.ph": "z. B. 2 Jahre, getigert",
      "list.photo": "Foto-URL (optional)",
      "list.photo.ph": "https://… (Inhaber kann später hinzufügen)",
      "list.body": "Erzählen Sie von diesem Tier",
      "list.body.ph": "Geschichte, Wesen, Aufenthaltsort und wie man den Betreuer erreicht.",
      "list.contact": "Ihr Kontakt (für den Adoptierenden)",
      "list.contact.ph": "E-Mail oder Telefon",
      "list.submitter": "Ihr Name",
      "list.submit": "Zur Prüfung einreichen",
      "list.submitting": "Wird eingereicht…",
      "list.note": "Ihre Meldung wird erst nach Freigabe durch den Inhaber öffentlich.",
      "list.ok": "Danke — Ihr Tier wurde zur Prüfung durch den Inhaber eingereicht.",
      "list.err": "Entschuldigung, etwas ist schiefgelaufen.",

      "post.back": "← Zurück zum Tagebuch",
      "post.loading": "Beitrag wird geladen…",
      "post.none": "Kein Beitrag angegeben.",
      "post.notFound": "Dieser Beitrag wurde nicht gefunden.",
      "post.error": "Dieser Beitrag konnte nicht geladen werden.",

      "badge.donated": "gespendet",
      "badge.adopter": "Adoptant",
      "badge.volunteer": "Helfer",
      "and": "und",
      "theirAngel": "ihrem Engel"
    },

    /* ========== TÜRKÇE ========== */
    tr: {
      "meta.title.home": "Healing Angels — Kediler ve köpekler bizi nasıl iyileştirir, her dua ile",
      "meta.desc.home": "Healing Angels, kedilerin ve köpeklerin bizi nasıl iyileştirdiğine — ve bizim de onları nasıl iyileştirdiğimize — adanmış dua dolu bir topluluktur. Caycuma Dostları, barınak, sahiplenme ve bakımı destekler.",
      "meta.title.members": "Üyeler ve Terapi Hikâyeleri | Healing Angels",
      "meta.desc.members": "Healing Angels üyeleri ve terapi hikâyeleri — bir kedi veya köpeğin onları nasıl iyileştirdiği. Kendi hikâyenizi paylaşın ve katılın.",
      "meta.title.blog": "Günlük | Healing Angels",
      "meta.desc.blog": "Healing Angels’tan notlar, dualar ve sakin hikâyeler.",
      "meta.title.club": "Caycuma Dostları — bağış, gönüllülük, sahiplenme | Healing Angels",
      "meta.desc.club": "Caycuma Dostları: Caycuma’daki sokak kedi ve köpeklerini besleyen, iyileştiren ve yuva bulan küçük bir topluluk. Mama bağışlayın, vakit verin, sahiplenin veya bir hayvan listeleyin.",
      "meta.title.post": "Yazı | Healing Angels",

      "brand.tag": "Dua · Kediler · Şifa",
      "nav.home": "Ana Sayfa",
      "nav.members": "Üyeler",
      "nav.blog": "Blog",
      "nav.club": "Caycuma Dostları",
      "nav.owner": "Sahip",
      "nav.open": "Menüyü aç",
      "nav.close": "Menüyü kapat",
      "lang.label": "Dil",

      "footer.tagline": "Kedilerin ve köpeklerin bizi nasıl iyileştirdiğine — ve bizim de onları nasıl iyileştirdiğimize — adanmış dua dolu bir topluluk.",
      "footer.explore": "Keşfet",
      "footer.takePart": "Katıl",
      "footer.owner": "Sahip",
      "footer.ownerLogin": "Sahip girişi",
      "footer.contact": "İletişim",
      "footer.becomeMember": "Üye ol",
      "footer.donate": "Bağış yap",
      "footer.volunteer": "Gönüllü ol",
      "footer.adopt": "Sahiplen",
      "footer.made": "sakin dualarla yapıldı",
      "footer.copy": "Healing Angels · Caycuma Dostları",

      "home.eyebrow": "Dua dolu topluluk",
      "home.h1.a": "Küçük bir ",
      "home.h1.b": "pençeli melek",
      "home.h1.c": " insan yüreğini nasıl iyileştirir.",
      "home.lede": "Healing Angels, lütfu küçük omuzlarında taşıyan kedi ve köpeklere — ve onları seven insanlara — adanmış, dünyanın sakin, dua dolu bir köşesidir.",
      "home.cta.insight": "Bugünün İçgörüsü",
      "home.cta.members": "Üyelerle tanışın",
      "home.cta.club": "Caycuma Dostları",
      "home.hero.caption": "~ bir dost, bir dua, bir mırıldanma ~",
      "home.badge.title": "Caycuma Dostları",
      "home.badge.sub": "kurtar · sahiplen · dua et",

      "insight.eyebrow": "Günün İçgörüsü",
      "insight.h2": "Kitaptan bir söz",
      "insight.p": "Her gün kitaptan bir cümle sunulur — kısa bir dua ve nefes alacak bir anla birlikte. Sahip her sabah yenisini yazar.",
      "insight.prayerLabel": "Kısa bir dua",
      "insight.loading": "Bugünün içgörüsü yükleniyor…",
      "insight.fallback.excerpt": "Sahip yazdığında bugünün içgörüsü burada görünecek.",
      "insight.fallback.prayer": "Kısa bir dua gelecek.",
      "insight.empty.excerpt": "Bugünün sözü yazılıyor. Lütfen biraz sonra tekrar gelin.",

      "therapy.eyebrow": "Terapi Seansı",
      "therapy.h2": "Şifa hikâyeleri",
      "therapy.p": "Dinleyen pençeler. Avutan bıyıklar. Healing Angels üyeleri, bir kedi veya köpeğin onlara nasıl yardım ettiğini anlatır.",
      "therapy.seeAll": "Tüm üyeleri görün ve hikâyenizi paylaşın",
      "therapy.loading": "Hikâyeler yükleniyor…",
      "therapy.empty": "Henüz hikâye yok — ilk paylaşan siz olun.",
      "therapy.error": "Üyeler paylaştıkça hikâyeler burada görünecek.",

      "caycuma.eyebrow": "Caycuma Dostları",
      "caycuma.h2": "Küçük melekleri beslememize, iyileştirmemize ve yuva bulmamıza yardım edin",
      "caycuma.p": "Caycuma’da sokak kedi ve köpeklerine bakan küçük bir topluluk. Mama bağışlayın, vakit verin, sahiplenin veya yuva arayan bir hayvan listeleyin.",
      "caycuma.donate.h3": "Mama bağışla",
      "caycuma.donate.p": "Her küçük armağan, Caycuma’da bir sokak kedisi veya köpeği için mama kapları ve sıcak bir battaniye alır.",
      "caycuma.donate.a": "Mama ver →",
      "caycuma.volunteer.h3": "Gönüllü ol",
      "caycuma.volunteer.p": "Bir saatinizi verin. Besleyin, gezdirin, geçici bakın veya utangaç bir kurtarılmış hayvan güvenmeyi öğrenene kadar yanında oturun.",
      "caycuma.volunteer.a": "Zamanınızı sunun →",
      "caycuma.adopt.h3": "Sahiplen",
      "caycuma.adopt.p": "Evinizi ve yüreğinizi açın. Caycuma’da kendine ait birini bekleyen kedi ve köpeklerle tanışın.",
      "caycuma.adopt.a": "Kim bekliyor? →",
      "caycuma.list.h3": "Hayvan listele",
      "caycuma.list.p": "Yuva arayan bir kedi veya köpek mi biliyorsunuz? Buraya ekleyin; topluluğumuz duyurmayı yardımcı olur.",
      "caycuma.list.a": "Hayvan listele →",

      "blog.eyebrow": "Günlükten",
      "blog.h2": "Healing Angels notları",
      "blog.p": "Sahibin yansımaları, dua notları ve sakin hikâyeleri — çoğu gün yazılır.",
      "blog.readJournal": "Günlüğü oku →",
      "blog.loading": "Yazılar yükleniyor…",
      "blog.empty": "Henüz günlük yazısı yok — sahip ilkini hazırlıyor.",
      "blog.error": "Günlük yazıları yakında burada görünecek.",
      "blog.read": "Oku →",

      "cta.h2": "Bizimle yürür müsünüz?",
      "cta.p": "Yazar olmanız veya bir hikâyeniz olması gerekmez. Yalnızca küçük bir canlıyı sevmeniz ve ona iyilik dilemeniz yeter. Bize katılın — ve sakin bir dua getirin.",
      "cta.member": "Üye ol",
      "cta.donate": "Caycuma’ya bağış yap",

      "members.eyebrow": "Terapi Seansı · Üyeler",
      "members.h2": "Pençeli bir melek tarafından iyileşme hikâyeleri",
      "members.p": "Her Healing Angels üyesinin bir hikâyesi vardır. Kimi sessiz, kimi büyük — hepsi gerçektir. Aşağıda paylaşmayı seçenler var.",
      "members.loading": "Üyeler yükleniyor…",
      "members.empty": "Henüz üye yok — aşağıda ilk hikâyenizi paylaşın.",
      "members.error": "Üyeler yakında burada görünecek.",
      "members.contact": "İletişim:",
      "join.eyebrow": "Üye ol",
      "join.h2": "Hikâyenizi paylaşın",
      "join.p": "Üyelik ücretsiz ve yumuşaktır. Kendinizden ve kediniz veya köpeğinizden bahsedin. Sahip hikâyenizi okuyacak; onaylandıktan sonra yukarıdaki Terapi Seansı galerisinde yer alacak.",
      "join.name": "Adınız",
      "join.location": "Şehir / kasaba",
      "join.pet": "Hayvanın adı",
      "join.species": "Tür",
      "join.species.cat": "Kedi",
      "join.species.dog": "Köpek",
      "join.species.other": "Diğer",
      "join.breed": "Irk / açıklama",
      "join.breed.ph": "örn. tekir, golden retriever",
      "join.photo": "Fotoğraf URL’si (isteğe bağlı)",
      "join.photo.ph": "https://… (sahip daha sonra fotoğraf ekleyebilir)",
      "join.story": "Terapi hikâyeniz",
      "join.story.ph": "Kediniz veya köpeğiniz size nasıl yardım etti? Birkaç cümle yeter. İsterseniz daha fazla yazabilirsiniz.",
      "join.badges": "Rozetler (isteğe bağlı)",
      "join.badge.donated": "Caycuma Dostları’na bağış yaptım",
      "join.badge.adopter": "Bir kedi veya köpek sahiplendim",
      "join.badge.volunteer": "Hayvanlarla gönüllü çalışıyorum",
      "join.contact": "Herkese açık iletişim (isteğe bağlı — yalnızca doldurursanız gösterilir)",
      "join.contact.ph": "e-posta, web sitesi veya sosyal medya",
      "join.submit": "Hikâyemi gönder",
      "join.sending": "Gönderiliyor…",
      "join.note": "Hikâyeniz sahibin onayına kadar bekletilir. Bize güvendiğiniz için teşekkürler.",
      "join.ok": "Teşekkürler — hikâyeniz gönderildi. Sahip yakında okuyup onaylayacak.",
      "join.err": "Üzgünüz, bir şeyler ters gitti.",

      "blogpage.eyebrow": "Günlük",
      "blogpage.h2": "Healing Angels notları",
      "blogpage.p": "Sahibin yazdığı yansımalar, dua notları ve sakin hikâyeler — çoğu gün, kediler izin verdiğinde.",

      "club.eyebrow": "Caycuma Dostları",
      "club.h2": "Henüz evi olmayan küçük melekler için",
      "club.p": "Caycuma, büyük yürekli ve birçok sokak kedi ve köpeği olan küçük bir kasabadır. Caycuma Dostları, Healing Angels’ın pratik koludur: mama, geçici bakım ve sonsuz yuvalar.",
      "donate.eyebrow": "Bağış",
      "donate.h2": "Bir kâse mama, sıcak bir gece",
      "donate.p1": "Her armağan — büyük ya da küçük — Caycuma’da bir kedi veya köpek için mama, ilaç ve barınak alır. Burada hem kediler hem köpekler bakılır; kimse dışarıda bırakılmaz.",
      "donate.p2": "Bağışlar güvenle işlenir. Bir kez verebilir veya bir kurtarılmış hayvanı sessizce besleyen küçük aylık bir armağan kurabilirsiniz.",
      "donate.10": "€10 ver",
      "donate.25": "€25 ver",
      "donate.50": "€50 ver",
      "donate.custom": "Özel tutar",
      "donate.note": "Tüm bağışlar doğrudan Caycuma’da kedi ve köpek mamasına, veteriner bakımına ve sıcak yataklara gider.",
      "donate.setup": "Bağış bağlantısını sahip kuruyor. Şimdi vermek için lütfen hello@healingangels.site yazın — teşekkürler.",
      "donate.how": "Armağanınız nasıl yardım eder",
      "donate.item10": "€10 — bir sokak kedisi için bir haftalık mama",
      "donate.item25": "€25 — bir köpek için veteriner kontrolü + bit tedavisi",
      "donate.item50": "€50 — bir kedi veya köpeğin kısırlaştırılması, tüm koloniyi korur",
      "donate.item100": "€100 — acil ameliyat katkısı",
      "vol.eyebrow": "Gönüllü",
      "vol.h2": "Zamanınızı verin",
      "vol.p": "Bir saat bile yeter. Besleyin, gezdirin, geçici bakın, taşıyın veya utangaç bir kurtarılmış hayvan güvenene kadar yanında oturun.",
      "vol.name": "Adınız",
      "vol.email": "E-posta",
      "vol.city": "Şehir / kasaba",
      "vol.role": "Nasıl yardım etmek istersiniz?",
      "vol.role.feed": "Sokak kedilerini beslemek",
      "vol.role.walk": "Kurtarılmış köpekleri gezdirmek",
      "vol.role.foster": "Geçici bakım",
      "vol.role.transport": "Veterinere taşıma",
      "vol.role.visit": "Utangaç kurtarılmışları ziyaret",
      "vol.role.other": "Başka bir şey",
      "vol.avail": "Genelde ne zaman müsaitsiniz?",
      "vol.avail.ph": "örn. hafta içi akşamları, hafta sonları",
      "vol.msg": "Bize iletmek istediğiniz bir şey var mı?",
      "vol.msg.ph": "Kendiniz, hayvan deneyiminiz veya en çok hangi hayvanlara yardım etmek istediğiniz hakkında kısa bir not.",
      "vol.submit": "Zamanınızı sunun",
      "vol.sending": "Gönderiliyor…",
      "vol.note": "Sahip teklifinizi alacak ve e-posta ile yanıtlayacak.",
      "vol.ok": "Teşekkürler — teklifiniz gönderildi. Sahip e-posta ile yanıtlayacak.",
      "vol.err": "Üzgünüz, bir şeyler ters gitti.",
      "adopt.eyebrow": "Sahiplen",
      "adopt.h2": "Yuva bekleyen kim var?",
      "adopt.p": "Şu an Caycuma’da aile arayan kedi ve köpekler. Başvurmak için bir karta dokunun — sahip süreci sizinle yürütecek.",
      "adopt.loading": "Sahiplendirilebilir hayvanlar yükleniyor…",
      "adopt.empty": "Şu an sahiplenme için listelenmiş hayvan yok. Yakında tekrar bakın — veya aşağıda kendiniz listeleyin.",
      "adopt.error": "Sahiplendirilebilir hayvanlar yakında burada görünecek.",
      "adopt.apply": "Başvuru için:",
      "adopt.contactOwner": "sahiple iletişime geçin",
      "list.eyebrow": "Hayvan listele",
      "list.h2": "Yuva arayan bir kedi veya köpek mi biliyorsunuz?",
      "list.p": "Sahiplenilmesi gereken bir hayvan hakkında bize yazın. Sahip gönderinizi inceleyecek; onaylandıktan sonra yukarıdaki Sahiplen bölümünde görünecek.",
      "list.petName": "Hayvanın adı",
      "list.petName.ph": "örn. Mochi",
      "list.species": "Tür",
      "list.age": "Yaş (yaklaşık)",
      "list.age.ph": "örn. 2 yaş, tekir",
      "list.photo": "Fotoğraf URL’si (isteğe bağlı)",
      "list.photo.ph": "https://… (sahip sonra ekleyebilir)",
      "list.body": "Bu hayvandan bahsedin",
      "list.body.ph": "Hikâyesi, mizacı, nerede olduğu ve bakıcıya nasıl ulaşılacağı.",
      "list.contact": "İletişim bilginiz (sahiplenici için)",
      "list.contact.ph": "e-posta veya telefon",
      "list.submitter": "Adınız",
      "list.submit": "İncelemeye gönder",
      "list.submitting": "Gönderiliyor…",
      "list.note": "Gönderiniz sahibin onayına kadar kamuya açık olmaz.",
      "list.ok": "Teşekkürler — hayvanınız sahibin incelemesine gönderildi.",
      "list.err": "Üzgünüz, bir şeyler ters gitti.",

      "post.back": "← Günlüğe dön",
      "post.loading": "Yazı yükleniyor…",
      "post.none": "Yazı belirtilmedi.",
      "post.notFound": "Bu yazı bulunamadı.",
      "post.error": "Bu yazı yüklenemedi.",

      "badge.donated": "bağışçı",
      "badge.adopter": "sahiplenici",
      "badge.volunteer": "gönüllü",
      "and": "ve",
      "theirAngel": "melekleri"
    },

    /* ========== فارسی ========== */
    fa: {
      "meta.title.home": "فرشتگان شفا — چگونه گربه‌ها و سگ‌ها ما را شفا می‌دهند، دعا به دعا",
      "meta.desc.home": "فرشتگان شفا جامعه‌ای دعاگو دربارهٔ این است که گربه‌ها و سگ‌ها چگونه ما را شفا می‌دهند و ما چگونه در برابر آن‌ها را شفا می‌دهیم. دوستان چای‌جوما از نجات، فرزندخواندگی و مراقبت از گربه و سگ پشتیبانی می‌کند.",
      "meta.title.members": "اعضا و داستان‌های درمانی | فرشتگان شفا",
      "meta.desc.members": "اعضای فرشتگان شفا و داستان‌های درمانی‌شان — چگونه یک گربه یا سگ به شفایشان کمک کرد. داستان خود را به اشتراک بگذارید و عضو شوید.",
      "meta.title.blog": "دفترچه | فرشتگان شفا",
      "meta.desc.blog": "یادداشت‌ها، دعاها و داستان‌های آرام از فرشتگان شفا.",
      "meta.title.club": "دوستان چای‌جوما — کمک مالی، داوطلبی، فرزندخواندگی | فرشتگان شفا",
      "meta.desc.club": "دوستان چای‌جوما: جامعهٔ کوچکی که گربه‌ها و سگ‌های خیابانی چای‌جوما را تغذیه، درمان و خانه‌دار می‌کند. غذا اهدا کنید، وقت بگذارید، به فرزندخواندگی بگیرید یا حیوانی را ثبت کنید.",
      "meta.title.post": "نوشته | فرشتگان شفا",

      "brand.tag": "دعا · گربه · شفا",
      "nav.home": "خانه",
      "nav.members": "اعضا",
      "nav.blog": "بلاگ",
      "nav.club": "دوستان چای‌جوما",
      "nav.owner": "مدیر",
      "nav.open": "باز کردن منو",
      "nav.close": "بستن منو",
      "lang.label": "زبان",

      "footer.tagline": "جامعه‌ای دعاگو دربارهٔ اینکه گربه‌ها و سگ‌ها چگونه ما را شفا می‌دهند — و ما چگونه در برابر آن‌ها را شفا می‌دهیم.",
      "footer.explore": "کاوش",
      "footer.takePart": "همراهی",
      "footer.owner": "مدیر",
      "footer.ownerLogin": "ورود مدیر",
      "footer.contact": "تماس",
      "footer.becomeMember": "عضو شوید",
      "footer.donate": "اهدا",
      "footer.volunteer": "داوطلبی",
      "footer.adopt": "فرزندخواندگی",
      "footer.made": "ساخته‌شده با دعاهای آرام",
      "footer.copy": "فرشتگان شفا · دوستان چای‌جوما",

      "home.eyebrow": "جامعهٔ دعاگو",
      "home.h1.a": "چگونه یک ",
      "home.h1.b": "فرشتهٔ کوچک با پنجه",
      "home.h1.c": " قلب انسان را شفا می‌دهد.",
      "home.lede": "فرشتگان شفا گوشه‌ای آرام و دعاگو از جهان است که به گربه‌ها و سگ‌هایی اختصاص دارد که لطف را بر شانه‌های کوچک‌شان حمل می‌کنند — و به کسانی که آن‌ها را دوست دارند.",
      "home.cta.insight": "بینش امروز",
      "home.cta.members": "آشنایی با اعضا",
      "home.cta.club": "دوستان چای‌جوما",
      "home.hero.caption": "~ یک دوست، یک دعا، یک خرخر ~",
      "home.badge.title": "دوستان چای‌جوما",
      "home.badge.sub": "نجات · فرزندخواندگی · دعا",

      "insight.eyebrow": "بینش روز",
      "insight.h2": "کلمه‌ای از کتاب",
      "insight.p": "هر روز عبارتی از کتاب عرضه می‌شود — همراه با دعایی کوتاه و لحظه‌ای برای نفس کشیدن. مدیر هر صبح آن را تازه می‌نویسد.",
      "insight.prayerLabel": "دعای کوتاه",
      "insight.loading": "در حال بارگذاری بینش امروز…",
      "insight.fallback.excerpt": "بینش امروز پس از نوشتن مدیر اینجا ظاهر می‌شود.",
      "insight.fallback.prayer": "دعایی کوتاه در پی خواهد آمد.",
      "insight.empty.excerpt": "کلمهٔ امروز در حال نوشته شدن است. لطفاً کمی بعد بازگردید.",

      "therapy.eyebrow": "جلسهٔ درمانی",
      "therapy.h2": "داستان‌های شفا",
      "therapy.p": "پنجه‌هایی که گوش دادند. سیبیل‌هایی که آرامش دادند. اعضای فرشتگان شفا می‌گویند یک گربه یا سگ چگونه به آن‌ها کمک کرد.",
      "therapy.seeAll": "دیدن همهٔ اعضا و به اشتراک‌گذاری داستان شما",
      "therapy.loading": "در حال بارگذاری داستان‌ها…",
      "therapy.empty": "هنوز داستانی نیست — نخستین کسی باشید که داستانش را به اشتراک می‌گذارد.",
      "therapy.error": "داستان‌ها پس از اشتراک‌گذاری اعضا اینجا ظاهر می‌شوند.",

      "caycuma.eyebrow": "دوستان چای‌جوما",
      "caycuma.h2": "به ما کمک کنید فرشته‌های کوچک را تغذیه، درمان و خانه‌دار کنیم",
      "caycuma.p": "جامعهٔ کوچکی در چای‌جوما که از گربه‌ها و سگ‌های خیابانی مراقبت می‌کند. غذا اهدا کنید، وقت بگذارید، به فرزندخواندگی بگیرید، یا حیوانی را که نیاز به خانه دارد ثبت کنید.",
      "caycuma.donate.h3": "اهدای غذا",
      "caycuma.donate.p": "هر هدیهٔ کوچک برای یک گربه یا سگ خیابانی در چای‌جوما کاسه‌های غذا و پتویی گرم می‌خرد.",
      "caycuma.donate.a": "غذا بدهید ←",
      "caycuma.volunteer.h3": "داوطلبی",
      "caycuma.volunteer.p": "یک ساعت از وقت‌تان را بدهید. غذا دهید، پیاده‌روی کنید، موقتاً نگهداری کنید، یا کنار یک حیوان نجات‌یافتهٔ خجالتی بنشینید تا دوباره اعتماد بیاموزد.",
      "caycuma.volunteer.a": "وقت‌تان را پیشنهاد دهید ←",
      "caycuma.adopt.h3": "فرزندخواندگی",
      "caycuma.adopt.p": "خانه و قلب‌تان را باز کنید. با گربه‌ها و سگ‌هایی در چای‌جوما آشنا شوید که منتظر کسی هستند که آن‌ها را از آنِ خود بداند.",
      "caycuma.adopt.a": "ببینید چه کسی منتظر است ←",
      "caycuma.list.h3": "ثبت حیوان",
      "caycuma.list.p": "گربه یا سگی می‌شناسید که به خانه نیاز دارد؟ اینجا اضافه کنید و جامعهٔ ما به پخش خبر کمک می‌کند.",
      "caycuma.list.a": "ثبت حیوان ←",

      "blog.eyebrow": "از دفترچه",
      "blog.h2": "یادداشت‌هایی از فرشتگان شفا",
      "blog.p": "تأملات، یادداشت‌های دعا و داستان‌های آرام مدیر — که بیشتر روزها نوشته می‌شود.",
      "blog.readJournal": "خواندن دفترچه ←",
      "blog.loading": "در حال بارگذاری نوشته‌ها…",
      "blog.empty": "هنوز نوشته‌ای در دفترچه نیست — مدیر در حال آماده‌سازی اولین است.",
      "blog.error": "نوشته‌های دفترچه به‌زودی اینجا ظاهر می‌شوند.",
      "blog.read": "بخوانید ←",

      "cta.h2": "با ما همراه می‌شوید؟",
      "cta.p": "لازم نیست نویسنده باشید یا داستانی داشته باشید. فقط کافی است موجود کوچکی را دوست بدارید و برایش خیر بخواهید. به ما بپیوندید — و دعایی آرام با خود بیاورید.",
      "cta.member": "عضو شوید",
      "cta.donate": "اهدا به چای‌جوما",

      "members.eyebrow": "جلسهٔ درمانی · اعضا",
      "members.h2": "داستان‌هایی از شفا یافتن با فرشته‌ای با پنجه",
      "members.p": "هر عضو فرشتگان شفا داستانی دارد. بعضی آرام‌اند، بعضی بزرگ — همه راست‌اند. در زیر کسانی هستند که انتخاب کردند داستان‌شان را به اشتراک بگذارند.",
      "members.loading": "در حال بارگذاری اعضا…",
      "members.empty": "هنوز عضوی نیست — نخستین کسی باشید که داستانش را در زیر به اشتراک می‌گذارد.",
      "members.error": "اعضا به‌زودی اینجا ظاهر می‌شوند.",
      "members.contact": "تماس:",
      "join.eyebrow": "عضو شوید",
      "join.h2": "داستان‌تان را به اشتراک بگذارید",
      "join.p": "عضویت رایگان و ملایم است. از خودتان و گربه یا سگ‌تان بگویید. مدیر داستان شما را می‌خواند و پس از تأیید، در گالری جلسهٔ درمانی بالا ظاهر می‌شود.",
      "join.name": "نام شما",
      "join.location": "شهر / شهرک",
      "join.pet": "نام حیوان",
      "join.species": "گونه",
      "join.species.cat": "گربه",
      "join.species.dog": "سگ",
      "join.species.other": "دیگر",
      "join.breed": "نژاد / توضیح",
      "join.breed.ph": "مثلاً راهراه، گلدن رتریور",
      "join.photo": "نشانی عکس (اختیاری)",
      "join.photo.ph": "https://… (مدیر بعداً می‌تواند عکس اضافه کند)",
      "join.story": "داستان درمانی شما",
      "join.story.ph": "گربه یا سگ‌تان چگونه به شما کمک کرد؟ چند جمله کافی است. اگر بخواهید می‌توانید بیشتر بنویسید.",
      "join.badges": "نشان‌ها (اختیاری)",
      "join.badge.donated": "به دوستان چای‌جوما کمک مالی کرده‌ام",
      "join.badge.adopter": "گربه یا سگی به فرزندخواندگی گرفته‌ام",
      "join.badge.volunteer": "با حیوانات داوطلبانه کار می‌کنم",
      "join.contact": "تماس عمومی (اختیاری — فقط اگر پر کنید نمایش داده می‌شود)",
      "join.contact.ph": "ایمیل، وب‌سایت یا شناسهٔ شبکه‌های اجتماعی",
      "join.submit": "ارسال داستان من",
      "join.sending": "در حال ارسال…",
      "join.note": "داستان شما تا تأیید مدیر نگه داشته می‌شود. سپاس که به ما اعتماد کردید.",
      "join.ok": "سپاس — داستان شما ارسال شد. مدیر به‌زودی آن را می‌خواند و تأیید می‌کند.",
      "join.err": "متأسفیم، مشکلی پیش آمد.",

      "blogpage.eyebrow": "دفترچه",
      "blogpage.h2": "یادداشت‌هایی از فرشتگان شفا",
      "blogpage.p": "تأملات، یادداشت‌های دعا و داستان‌های آرام نوشتهٔ مدیر — بیشتر روزها، وقتی گربه‌ها اجازه دهند.",

      "club.eyebrow": "دوستان چای‌جوما",
      "club.h2": "برای فرشته‌های کوچکی که هنوز خانه ندارند",
      "club.p": "چای‌جوما شهرکی کوچک با قلبی بزرگ و بسیاری گربه و سگ خیابانی است. دوستان چای‌جوما بازوی عملی فرشتگان شفاست: غذا، نگهداری موقت و خانه‌های همیشگی.",
      "donate.eyebrow": "اهدا",
      "donate.h2": "کاسه‌ای غذا، شبی گرم",
      "donate.p1": "هر هدیه — بزرگ یا کوچک — برای یک گربه یا سگ در چای‌جوما غذا، دارو و سرپناه می‌خرد. اینجا هم گربه‌ها و هم سگ‌ها مراقبت می‌شوند؛ کسی جا نمی‌ماند.",
      "donate.p2": "اهداها به‌صورت امن انجام می‌شود. می‌توانید یک‌بار بدهید یا هدیه‌ای ماهانهٔ کوچک تنظیم کنید که بی‌صدا یک نجات‌یافته را سیر نگه دارد.",
      "donate.10": "اهدای ۱۰ یورو",
      "donate.25": "اهدای ۲۵ یورو",
      "donate.50": "اهدای ۵۰ یورو",
      "donate.custom": "مبلغ دلخواه",
      "donate.note": "همهٔ اهداها مستقیماً صرف غذای گربه و سگ، مراقبت دامپزشکی و رختخواب گرم در چای‌جوما می‌شود.",
      "donate.setup": "پیوند اهدا توسط مدیر در حال راه‌اندازی است. برای کمک اکنون لطفاً به hello@healingangels.site ایمیل بزنید — سپاس.",
      "donate.how": "هدیهٔ شما چگونه کمک می‌کند",
      "donate.item10": "۱۰ یورو — یک هفته غذای خشک برای یک گربهٔ خیابانی",
      "donate.item25": "۲۵ یورو — معاینهٔ دامپزشک + درمان کک برای یک سگ",
      "donate.item50": "۵۰ یورو — عقیم‌سازی یک گربه یا سگ، به سود کل کلونی",
      "donate.item100": "۱۰۰ یورو — کمک به جراحی اضطراری",
      "vol.eyebrow": "داوطلبی",
      "vol.h2": "وقت‌تان را بدهید",
      "vol.p": "حتی یک ساعت هم کمک است. غذا دهید، پیاده‌روی کنید، موقتاً نگهداری کنید، جابه‌جا کنید، یا کنار یک نجات‌یافتهٔ خجالتی بنشینید تا اعتماد کند.",
      "vol.name": "نام شما",
      "vol.email": "ایمیل",
      "vol.city": "شهر / شهرک",
      "vol.role": "چگونه می‌خواهید کمک کنید؟",
      "vol.role.feed": "غذا دادن به گربه‌های خیابانی",
      "vol.role.walk": "پیاده‌روی با سگ‌های نجات‌یافته",
      "vol.role.foster": "نگهداری موقت",
      "vol.role.transport": "انتقال به دامپزشک",
      "vol.role.visit": "دیدار با نجات‌یافته‌های خجالتی",
      "vol.role.other": "چیز دیگر",
      "vol.avail": "معمولاً چه وقت آزادید؟",
      "vol.avail.ph": "مثلاً عصرهای روزهای هفته، آخر هفته‌ها",
      "vol.msg": "چیزی هست که بخواهید بدانیم؟",
      "vol.msg.ph": "یادداشتی کوتاه دربارهٔ خودتان، تجربه‌تان با حیوانات، یا اینکه بیشتر به کدام حیوانات کمک می‌خواهید.",
      "vol.submit": "پیشنهاد وقت‌تان",
      "vol.sending": "در حال ارسال…",
      "vol.note": "مدیر پیشنهاد شما را دریافت می‌کند و با ایمیل پاسخ می‌دهد.",
      "vol.ok": "سپاس — پیشنهاد شما ارسال شد. مدیر با ایمیل پاسخ می‌دهد.",
      "vol.err": "متأسفیم، مشکلی پیش آمد.",
      "adopt.eyebrow": "فرزندخواندگی",
      "adopt.h2": "چه کسی منتظر خانه است؟",
      "adopt.p": "گربه‌ها و سگ‌هایی که اکنون در چای‌جوما در جست‌وجوی خانواده هستند. روی کارت بزنید تا درخواست دهید — مدیر شما را در فرآیند همراهی می‌کند.",
      "adopt.loading": "در حال بارگذاری حیوانات قابل فرزندخواندگی…",
      "adopt.empty": "الان حیوانی برای فرزندخواندگی فهرست نشده. به‌زودی دوباره سر بزنید — یا خودتان یکی را در زیر ثبت کنید.",
      "adopt.error": "حیوانات قابل فرزندخواندگی به‌زودی اینجا ظاهر می‌شوند.",
      "adopt.apply": "برای درخواست:",
      "adopt.contactOwner": "با مدیر تماس بگیرید",
      "list.eyebrow": "ثبت حیوان",
      "list.h2": "گربه یا سگی می‌شناسید که به خانه نیاز دارد؟",
      "list.p": "دربارهٔ حیوانی که نیاز به فرزندخواندگی دارد به ما بگویید. مدیر ارسال شما را بررسی می‌کند و پس از تأیید، در بخش فرزندخواندگی بالا ظاهر می‌شود.",
      "list.petName": "نام حیوان",
      "list.petName.ph": "مثلاً موچی",
      "list.species": "گونه",
      "list.age": "سن (تقریبی)",
      "list.age.ph": "مثلاً ۲ سال، راهراه",
      "list.photo": "نشانی عکس (اختیاری)",
      "list.photo.ph": "https://… (مدیر بعداً می‌تواند اضافه کند)",
      "list.body": "دربارهٔ این حیوان بگویید",
      "list.body.ph": "داستان حیوان، خلق‌وخو، محل اقامت و نحوهٔ تماس با مراقب.",
      "list.contact": "تماس شما (برای پذیرنده)",
      "list.contact.ph": "ایمیل یا تلفن",
      "list.submitter": "نام شما",
      "list.submit": "ارسال برای بررسی",
      "list.submitting": "در حال ارسال…",
      "list.note": "ارسال شما تا تأیید مدیر عمومی نمی‌شود.",
      "list.ok": "سپاس — حیوان شما برای بررسی مدیر ارسال شد.",
      "list.err": "متأسفیم، مشکلی پیش آمد.",

      "post.back": "← بازگشت به دفترچه",
      "post.loading": "در حال بارگذاری نوشته…",
      "post.none": "نوشته‌ای مشخص نشده است.",
      "post.notFound": "این نوشته یافت نشد.",
      "post.error": "این نوشته بارگذاری نشد.",

      "badge.donated": "اهداکننده",
      "badge.adopter": "پذیرنده",
      "badge.volunteer": "داوطلب",
      "and": "و",
      "theirAngel": "فرشته‌شان"
    }
  };

  function getStoredLang() {
    try {
      var v = localStorage.getItem("ha_lang");
      if (v && T[v]) return v;
    } catch (e) {}
    return "en";
  }

  function langMeta(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  var current = getStoredLang();

  function t(key, fallback) {
    var bag = T[current] || T.en;
    if (bag[key] != null) return bag[key];
    if (T.en[key] != null) return T.en[key];
    return fallback != null ? fallback : key;
  }

  function setLang(code) {
    if (!T[code]) code = "en";
    current = code;
    try { localStorage.setItem("ha_lang", code); } catch (e) {}
    apply();
    try {
      window.dispatchEvent(new CustomEvent("ha:langchange", { detail: { lang: code } }));
    } catch (e) {}
  }

  function applyAttr(el, attr, key) {
    if (!key) return;
    var val = t(key);
    if (attr === "text") {
      // Preserve nested HTML when only direct text nodes / simple structure
      if (el.childElementCount === 0) el.textContent = val;
      else el.innerHTML = val;
    } else if (attr === "html") {
      el.innerHTML = val;
    } else if (attr === "placeholder") {
      el.setAttribute("placeholder", val);
    } else if (attr === "aria-label" || attr === "title" || attr === "alt") {
      el.setAttribute(attr, val);
    } else if (attr === "value") {
      el.value = val;
    } else {
      el.setAttribute(attr, val);
    }
  }

  function apply() {
    var meta = langMeta(current);
    var html = document.documentElement;
    html.setAttribute("lang", current === "en" ? "en" : current);
    html.setAttribute("dir", meta.dir);
    html.classList.toggle("lang-rtl", meta.dir === "rtl");
    html.classList.toggle("lang-fa", current === "fa");
    html.classList.toggle("lang-de", current === "de");
    html.classList.toggle("lang-tr", current === "tr");
    html.classList.toggle("lang-en", current === "en");

    // Meta title / description when data-i18n-meta is present
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      applyAttr(el, "text", el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      applyAttr(el, "html", el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      applyAttr(el, "placeholder", el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      applyAttr(el, "aria-label", el.getAttribute("data-i18n-aria"));
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      applyAttr(el, "title", el.getAttribute("data-i18n-title"));
    });
    document.querySelectorAll("option[data-i18n]").forEach(function (el) {
      applyAttr(el, "text", el.getAttribute("data-i18n"));
    });

    // Document title
    var titleKey = document.body && document.body.getAttribute("data-i18n-title");
    if (titleKey) document.title = t(titleKey);

    // Meta description
    var descKey = document.body && document.body.getAttribute("data-i18n-desc");
    if (descKey) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", t(descKey));
    }

    // Language switcher active state
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-lang") === current;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function buildSwitcher() {
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", t("lang.label"));

    LANGS.forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn" + (L.code === current ? " active" : "");
      b.setAttribute("data-lang", L.code);
      b.setAttribute("aria-pressed", L.code === current ? "true" : "false");
      b.setAttribute("title", L.label + " · " + L.native);
      b.innerHTML = '<span class="lang-code">' + L.code.toUpperCase() + '</span><span class="lang-native">' + L.native + "</span>";
      b.addEventListener("click", function () { setLang(L.code); });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function injectSwitcher() {
    var header = document.querySelector(".site-header .container");
    if (!header) return;
    if (header.querySelector(".lang-switch")) return;
    var nav = header.querySelector(".nav");
    var switcher = buildSwitcher();
    if (nav) header.insertBefore(switcher, nav);
    else header.appendChild(switcher);
  }

  function init() {
    injectSwitcher();
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose
  window.HA = window.HA || {};
  window.HA.i18n = {
    t: t,
    setLang: setLang,
    getLang: function () { return current; },
    apply: apply,
    langs: LANGS,
    locale: function () { return langMeta(current).locale; }
  };
})();
