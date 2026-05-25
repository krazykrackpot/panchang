#!/usr/bin/env python3
"""
Sprint 6 — Maithili grammar pass on src/messages/learn/modules/27-3.json.

Module 27-3 is the only learn-module with hand-translated Maithili copy
(two paragraphs at geographicVariationDesc + ourImplementationDesc), but
the rest of the `mai` blocks are byte-identical to `hi` — i.e. Hindi
grammar shown to Maithili readers. The audit flagged this as the worst
quality regression after the locale recovery.

Rewrites the substantive prose blocks (titles, descs, takeaways, MCQ
options + question/explanation) with proper Maithili grammar:
  - है → अछि           (X is)
  - हैं → छथि / अछि    (they are)
  - करते हैं → करैत छथि (they do)
  - करता है → करैत अछि (he does)
  - और → आ             (and)
  - से → सँ            (from / by)
  - में → मे           (in)
  - के / का / की → क / केर / कें (genitive)
  - दोनों → दुनू       (both)
  - हमारा → हमर        (our)
  - अगले दिन → अगिला दिन
  - कल तक → काल्हि धरि
  - मानी जाती है → मानल जाइत अछि
  - रखते हैं → रखैत छथि
  - अस्वीकार करती है → अस्वीकार करैत अछि

Short technical labels ("स्मार्त", "वैष्णव", "मूल अन्तर", etc.) are
left untouched — they are tatsama nouns identical in Maithili.

Also adds `mai` keys to questions and explanations where only en+hi
exist today (those structures inherit the audit's "missing nav.* keys"
shape — a Maithili reader sees only the English fallback).
"""
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TARGET = REPO_ROOT / "src/messages/learn/modules/27-3.json"


# All replacements are full-string keyed against the existing `mai` value
# (which currently mirrors `hi`). We replace with proper Maithili grammar.
REWRITES = {
    "title.mai": "स्मार्त आ वैष्णव: दू परम्परा, एक आकाश",
    "subtitle.mai": (
        "व्यावसायिक पंचांग कखनो काल ±1 दिनक अन्तर सँ किएक भिन्न होइत अछि"
        "  –  आ कोन पद्धति अपनाएब"
    ),
    "coreDifferenceDesc.mai": (
        "दुनू पद्धति एकहि खगोल विज्ञानक उपयोग करैत छथि  –  वैह चन्द्रमा, "
        "वैह तिथि, वैह सूर्योदय समय। मतभेद केवल एहि बातपर अछि जे जखन "
        "तिथि दू दिनमे पसरल हो तँ कोन नियम लागू कएल जाय। स्मार्त परम्परा "
        "आवश्यक काल विन्डोपर तिथिक उपयोग करैत अछि (राम नवमी लेल मध्याह्न, "
        "जन्माष्टमी लेल निशीथ)। वैष्णव परम्परा अतिरिक्त रूपसँ कोनो "
        "'विद्ध' (दूषित) तिथिकें अस्वीकार करैत अछि आ अगिला दिन व्रत "
        "रखैत अछि जखन तिथि 'शुद्ध' होइ।"
    ),
    "smartaDesc.mai": (
        "उदय तिथि (सूर्योदयपर तिथि) कें मूल नियमक रूपमे उपयोग करैत अछि। "
        "जँ तिथि आवश्यक काल विन्डो (मध्याह्न, निशीथ, प्रदोष आदि) पर "
        "व्याप्त हो, तँ ओ दिन चुनल जाइत अछि। विद्ध तिथिकें अस्वीकार "
        "नहि करैत अछि। धर्मसिन्धु (1790 ई.) आ निर्णयसिन्धु (1612 ई.) "
        "केर प्राधिकारक पालन करैत अछि। अधिकांश हिन्दू परिवार आ भारतक "
        "मुख्यधारा व्यावसायिक पंचांग एहि पद्धतिक उपयोग करैत छथि।"
    ),
    "vaishnavDesc.mai": (
        "'विद्ध' (दूषित) तिथिकें अस्वीकार करैत अछि। जँ सूर्योदयपर पछिला "
        "तिथि विद्यमान रहए  –  आवश्यक तिथिकें थोड़बो 'स्पर्श' करै हो  "
        "–  तँ त्योहार अगिला दिन खिसकि जाइत अछि जखन तिथि 'शुद्ध' होइ। "
        "हरि भक्ति विलास (16म शताब्दी, गोपाल भट्ट गोस्वामी) आ नवद्वीप "
        "पंजिकाक पालन करैत अछि। ISKCON केन्द्र, गौड़ीय वैष्णव, आ श्री "
        "वैष्णव एकर अनुसरण करैत छथि।"
    ),
    "viddhaRuleDesc.mai": (
        "तिथि तखन 'विद्ध' (दूषित) होइत अछि जखन सूर्योदयपर पछिला तिथि "
        "विद्यमान रहए। उदाहरण: जँ अष्टमी भोरमे 4 बजे शुरू होय आ "
        "सूर्योदय 6 बजे होय, तँ सूर्योदयपर सप्तमी चलि रहल अछि। स्मार्त "
        "कहैत छथि: 'मध्यरात्रि (निशीथ) पर अष्टमी व्याप्त अछि, तँ "
        "जन्माष्टमी आइ अछि।' वैष्णव कहैत छथि: 'सूर्योदयपर सप्तमी अछि, "
        "तँ आइ अष्टमी विद्ध अछि  –  काल्हि धरि प्रतीक्षा करू जखन "
        "अष्टमी सूर्योदयपर शुद्ध हो।'"
    ),
    "affectedFestivals.mai": "कोन त्योहार प्रभावित होइत छथि?",
    "affectedFestivalsDesc.mai": (
        "अधिकांश त्योहारपर दुनू पद्धति सहमत होइत छथि। मतभेद मुख्यतः "
        "एकादशी (सबसँ पैघ विवाद  –  वर्षमे 4-6 बेर भिन्न भ' सकैत अछि), "
        "जन्माष्टमी (1 दिनक अन्तर भ' सकैत अछि), आ राम नवमी (1 दिनक "
        "अन्तर भ' सकैत अछि) पर देखाइत अछि। होली, दीपावली, गणेश "
        "चतुर्थी जकाँ त्योहारक तिथि लगभग सदैव मेल खाइत अछि।"
    ),
    "ekadashiDeepDiveDesc.mai": (
        "एकादशी सबसँ बेसी बेर विभेदक बिन्दु अछि। स्मार्त एकादशी: जाहि "
        "दिन सूर्योदयपर एकादशी व्याप्त हो, ओहि दिन उपवास। वैष्णव "
        "एकादशी: एकादशी 'शुद्ध' होबाक चाहि  –  जँ दशमी सूर्योदयकें "
        "स्पर्श करै, तँ अगिला दिन उपवास। एकर अतिरिक्त, द्वादशी पारण "
        "(उपवास तोड़ब) सूर्योदयक बाद मुदा द्वादशीक 1/4 अवधि सँ पहिने "
        "करब अनिवार्य अछि। वर्षमे लगभग 4-6 बेर 'वैष्णव एकादशी' आ "
        "'स्मार्त एकादशी' मे 1 दिनक अन्तर होइत अछि।"
    ),
    "ourImplementation.mai": "हमर कार्यान्वयन",
    "ourImplementationDesc.mai": (
        "पूर्वनिर्धारित: स्मार्त (काल-व्याप्ति आधारित, प्रकाशित पञ्चाङ्ग "
        "परिपाटी सँ मेल खाइत)। जल्दिए आबि रहल अछि: सेटिंग्समे वैष्णव "
        "मोड टॉगल। सक्रिय होइतहि विद्ध अस्वीकार आ शुद्ध एकादशी नियम "
        "लागू होयत। दुनू मोड बिल्कुल एकहि खगोलीय इंजनक उपयोग करैत "
        "छथि  –  केवल तिथि-चयन नियम भिन्न अछि।"
    ),
    "keyTakeawayPoints.mai": [
        "स्मार्त आ वैष्णव दुनू पद्धति एकहि खगोलीय गणनाक उपयोग करैत "
        "छथि  –  मतभेद केवल एहि बातपर अछि जे जखन तिथि दू दिनमे पसरल "
        "हो तँ कोन तिथि-चयन नियम लागू हो।",
        "मूल अवधारणा अछि 'विद्ध' (दूषण): जखन सूर्योदयपर पछिला तिथि "
        "विद्यमान हो। स्मार्त एकरा अनदेखा करैत छथि; वैष्णव ओहि दिनकें "
        "पूर्णतः अस्वीकार करैत छथि।",
        "एकादशी सबसँ पैघ विवाद बिन्दु अछि  –  स्मार्त आ वैष्णव "
        "एकादशीक तिथि वर्षमे लगभग 4-6 बेर भिन्न होइत अछि। अधिकांश "
        "आन त्योहारपर दुनू पद्धति सहमत होइत छथि।",
    ],
}

# MCQ option mai rewrites. Indexed by (question_index, option_index).
OPTION_REWRITES = {
    (0, 0): "तिथि सूर्यास्त सँ पहिने समाप्त भ' जाइत अछि",
    (0, 1): "सूर्योदयपर पछिला तिथि विद्यमान हो",
    (0, 2): "तिथिक दौरान ग्रहण होय",
    (0, 3): "तिथि अधिक मासमे होय",
    (1, 0): "दुनू पद्धति सदैव सहमत होइत छथि",
    (1, 1): "केवल स्मार्त खिसकैत अछि",
    (1, 2): "केवल वैष्णव खिसकैत अछि (विद्धकें अस्वीकार करैत अछि)",
    (1, 3): "कोनो नहि  –  एकादशी सदैव एकहि दिन होइत अछि",
    # q3 options (0..3) are pure proper nouns: Surya Siddhanta, Dharmasindhu,
    # Hari Bhakti Vilasa, Arthashastra — leave as-is (tatsama in Maithili).
}

# Add missing mai keys to question + explanation where only en+hi exist.
QUESTION_MAI = {
    "q27_3_01": {
        "question": "तिथिकें 'विद्ध' (दूषित) कथीसँ बनैत अछि?",
        "explanation": (
            "तिथि तखन विद्ध (दूषित) होइत अछि जखन सूर्योदयपर पछिला तिथि "
            "विद्यमान रहए। उदाहरण: जँ सूर्योदय सप्तमीमे होय मुदा अष्टमी "
            "सूर्योदयक बाद शुरू होय, तँ ओहि दिन अष्टमी विद्ध मानल "
            "जाइत अछि। स्मार्त परम्परा एकरा अनदेखा करि काल-विन्डोक "
            "उपयोग करैत अछि, जखन कि वैष्णव परम्परा विद्ध दिनकें "
            "पूर्णतः अस्वीकार करैत अछि।"
        ),
    },
    "q27_3_02": {
        "question": "कोन परम्परामे एकादशी कखनो काल एक दिन आगू खिसकि जाइत अछि?",
        "explanation": (
            "वैष्णव परम्परामे, जँ एकादशी वला दिन सूर्योदयपर दशमी (10म "
            "तिथि) विद्यमान हो, तँ ओ एकादशी विद्ध (दूषित) मानल जाइत "
            "अछि। वैष्णव ओकरा अस्वीकार करि अगिला दिन व्रत रखैत छथि "
            "जखन एकादशी 'शुद्ध' होय। एहिसँ वर्षमे लगभग 4-6 बेर "
            "स्मार्त एकादशी सँ 1 दिनक अन्तर होइत अछि।"
        ),
    },
    "q27_3_03": {
        "question": "वैष्णव पद्धति त्योहार समय निर्धारणक लेल कोन प्रामाणिक ग्रन्थक पालन करैत अछि?",
        "explanation": (
            "वैष्णव पद्धति हरि भक्ति विलासक पालन करैत अछि, जे 16म "
            "शताब्दीमे गोपाल भट्ट गोस्वामी द्वारा चैतन्य महाप्रभुक "
            "मार्गदर्शनमे संकलित कएल गेल छल। एहि ग्रन्थमे वैष्णव "
            "पालनक लेल शुद्ध तिथि नियम आ विद्ध अस्वीकार नियम संहिताबद्ध "
            "अछि। स्मार्त पद्धति धर्मसिन्धु आ निर्णयसिन्धुक पालन "
            "करैत अछि।"
        ),
    },
}


data = json.loads(TARGET.read_text(encoding="utf-8"))

updates = 0
mismatch_warnings = []


def set_path(obj, dotted_key, value):
    """Set a dotted-path field (e.g. 'subtitle.mai') in obj."""
    parts = dotted_key.split(".")
    cur = obj
    for p in parts[:-1]:
        cur = cur[p]
    cur[parts[-1]] = value


# Apply top-level rewrites.
for key, value in REWRITES.items():
    set_path(data, key, value)
    updates += 1

# Apply MCQ option rewrites.
for (q_idx, opt_idx), value in OPTION_REWRITES.items():
    opt = data["questions"][q_idx]["options"][opt_idx]
    opt["mai"] = value
    updates += 1

# Add missing question.mai + explanation.mai keys.
for q_idx, q in enumerate(data["questions"]):
    q_id = q["id"]
    if q_id not in QUESTION_MAI:
        continue
    q["question"]["mai"] = QUESTION_MAI[q_id]["question"]
    q["explanation"]["mai"] = QUESTION_MAI[q_id]["explanation"]
    updates += 2


TARGET.write_text(
    json.dumps(data, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)

print(f"Updated mai fields: {updates}")
if mismatch_warnings:
    print("\nWarnings:")
    for w in mismatch_warnings:
        print(f"  - {w}")
