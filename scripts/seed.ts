#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

type SeedFile = { path: string; body: string };

const seedFiles: SeedFile[] = [
  {
    path: "protocols/can-bus/index.md",
    body: `---
title: "CAN Bus Fundamentals"
category: "protocols"
tags: ["can", "mcp2515", "tja1050", "embedded"]
level: "Beginner"
estimatedTime: 45
status: "Not Started"
---

# CAN Bus Fundamentals 📡

CAN 2.0A uses an 11-bit identifier, non-destructive arbitration, differential CAN_H/CAN_L signaling, CRC checking, ACK, and error confinement.

## Frame structure

| Field | Purpose |
| --- | --- |
| SOF | Dominant start bit |
| Arbitration | 11-bit ID + RTR; lower ID wins |
| Control | IDE, reserved bit, DLC |
| Data | 0-8 bytes |
| CRC/ACK/EOF | Integrity, acknowledgement, end marker |

## MCP2515 + TJA1050 wiring

\`\`\`mermaid
graph LR
  MCU[MCU SPI] --> MCP2515[MCP2515 CAN Controller]
  MCP2515 --> TJA1050[TJA1050 Transceiver]
  TJA1050 --> CANH[CAN_H]
  TJA1050 --> CANL[CAN_L]
  CANH --- TERM[120Ω termination]
  CANL --- TERM
\`\`\`

## EFLG quick reference

\`\`\`c
#define EWARN    0x01
#define RXWAR    0x02
#define TXWAR    0x04
#define RXEP     0x08
#define TXEP     0x10
#define RXBOERR  0x20
#define TXBOERR  0x40
#define RXBOOVFL 0x80
\`\`\`

- Use 120Ω termination at both physical ends.
- Match baud rate and sample point on every node.
- Check EFLG first when diagnosing bus-off, passive, or overflow issues.
`,
  },
  {
    path: "protocols/can-bus/quiz.json",
    body: JSON.stringify(
      {
        questions: [
          { question: "What is the function of the EFLG register in MCP2515?", options: ["Enable frame transmission", "Store error flags and status", "Configure baud rate", "Filter incoming messages"], correct: 1, explanation: "EFLG reports warning, passive, bus-off, and overflow error states." },
          { question: "What is the standard CAN termination value?", options: ["50Ω", "100Ω", "120Ω", "220Ω"], correct: 2, explanation: "High-speed CAN normally uses 120Ω at each physical end of the bus." },
          { question: "Which CAN ID wins arbitration?", options: ["Higher ID", "Lower ID", "Longer DLC", "First sender always"], correct: 1, explanation: "Dominant bits override recessive bits, so lower numeric identifiers have higher priority." },
          { question: "What should you verify first if CAN communication fails?", options: ["LCD contrast", "Termination and baud rate", "Wi-Fi channel", "ADC calibration"], correct: 1, explanation: "Termination, swapped lines, ground reference, and baud timing are common root causes." },
          { question: "What does bus-off mean?", options: ["Node transmits faster", "Node stopped participating due to excessive errors", "Node became master", "Bus is idle"], correct: 1, explanation: "A bus-off node must recover/reset before it can safely transmit again." }
        ]
      },
      null,
      2,
    ),
  },
  {
    path: "rtos/freertos-basics/index.md",
    body: `---
title: "FreeRTOS Basics"
category: "rtos"
tags: ["freertos", "task", "queue", "semaphore"]
level: "Beginner"
estimatedTime: 40
status: "Not Started"
---

# FreeRTOS Basics 🧠

A task is a schedulable function with its own stack. Use queues for data transfer and semaphores/mutexes for signaling or protecting shared resources.

## xTaskCreate pattern

\`\`\`c
BaseType_t ok = xTaskCreate(sensor_task, "sensor", 2048, NULL, 2, NULL);
if (ok != pdPASS) {
    /* Log, blink LED, or enter safe state. */
}
\`\`\`

## Checklist

- [ ] I can create two tasks.
- [ ] I can sync two tasks via a queue.
- [ ] I can explain when to use a mutex vs binary semaphore.
`,
  },
  {
    path: "japanese/technical-terms/index.md",
    body: `---
title: "Japanese Technical Terms"
category: "japanese"
tags: ["japanese", "technical", "horiba"]
level: "Beginner"
estimatedTime: 35
status: "Not Started"
---

# Japanese Technical Terms 🇯🇵

| English | Japanese | Romaji | Meaning |
| --- | --- | --- | --- |
| Embedded system | 組込みシステム | kumikomi shisutemu | Embedded product/software |
| Circuit | 回路 | kairo | Electrical circuit |
| Power supply | 電源 | dengen | Power source |
| Termination resistor | 終端抵抗 | shūtan teikō | CAN line termination |
| Specification | 仕様書 | shiyōsho | Requirements/spec document |

Audio pronunciation placeholder: add MP3 files later in \`public/audio\` and link them here.
`,
  },
];

console.log("🌱 Seeding Embedded Study Hub sample content...\n");
fs.mkdirSync(contentDir, { recursive: true });

let created = 0;
let skipped = 0;

for (const file of seedFiles) {
  const target = path.join(contentDir, file.path);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (fs.existsSync(target)) {
    skipped += 1;
    console.log(`↪️  Skipped existing ${file.path}`);
    continue;
  }

  fs.writeFileSync(target, file.body.trimStart() + "\n");
  created += 1;
  console.log(`✅ Created ${file.path}`);
}

console.log(`\nDone. Created ${created} file(s), skipped ${skipped} existing file(s).`);
console.log("Run npm run dev and open http://localhost:3000.");
