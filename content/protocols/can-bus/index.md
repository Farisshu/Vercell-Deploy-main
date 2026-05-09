---
title: "CAN Bus Fundamentals"
category: "protocols"
tags: ["can", "embedded", "communication", "automotive"]
level: "Beginner"
estimatedTime: 45
status: "Not Started"
---

# CAN Bus Fundamentals 📡

## Overview

Controller Area Network (CAN) is a robust vehicle bus standard designed to allow microcontrollers and devices to communicate with each other's applications without a host computer. It was originally developed by Bosch and Intel in the 1980s for automotive applications.

## Why CAN Bus?

- **Multi-master**: Any node can transmit when the bus is free
- **Priority-based arbitration**: Lower ID = higher priority
- **Error detection**: Built-in CRC, ACK, and error framing
- **Robust**: Differential signaling provides noise immunity
- **Cost-effective**: Two-wire interface reduces wiring complexity

## CAN 2.0A Frame Structure

A standard CAN frame consists of:

```
┌─────────────┬──────────┬─────────┬──────────┬─────────┬──────────┐
│ Start of    │ Arbitration│ Control │ Data     │ CRC     │ ACK      │ End of
│ Frame (SOF) │ Field    │ Field   │ Field    │ Field   │ Field    │ Frame (EOF)
│             │ (11-bit) │         │ (0-8 bytes)│ (15-bit)│          │
└─────────────┴──────────┴─────────┴──────────┴─────────┴──────────┘
```

### Key Fields Explained

1. **Start of Frame (SOF)**: Single dominant bit that signals start of transmission
2. **Arbitration Field**: Contains 11-bit identifier (standard CAN) + RTR bit
3. **Control Field**: IDE, r0, and DLC (Data Length Code)
4. **Data Field**: 0-8 bytes of payload data
5. **CRC Field**: 15-bit cyclic redundancy check for error detection
6. **ACK Field**: Receiver acknowledges successful reception
7. **End of Frame (EOF)**: 7 recessive bits marking end of frame

## MCP2515 CAN Controller

The MCP2515 is a popular standalone CAN controller with SPI interface.

### Key Registers

- **CNF1/CNF2/CNF3**: Configuration registers for baud rate
- **TXB0/TXB1/TXB2**: Transmit buffers
- **RXB0/RXB1**: Receive buffers
- **EFLG**: Error flag register

### EFLG Register Bits

```c
// EFLG - Error Flag Register
#define EWARN     0x01  // Error Warning
#define RXWAR     0x02  // Receive Error Warning
#define TXWAR     0x04  // Transmit Error Warning
#define RXEP      0x08  // Receive Error Passive
#define TXEP      0x10  // Transmit Error Passive
#define RXBOERR   0x20  // Receiver Bus-Off Error
#define TXBOERR   0x40  // Transmitter Bus-Off Error
#define RXBOOVFL  0x80  // Receiver Buffer Overflow
```

## Wiring: MCP2515 + TJA1050

```mermaid
graph LR
    MCU[Microcontroller] -->|SPI| MCP2515
    MCP2515 -->|TX| TJA1050
    MCP2515 -->|RX| TJA1050
    TJA1050 -->|CAN_H| Bus
    TJA1050 -->|CAN_L| Bus
    Bus -->|120Ω| Term[Termination Resistor]
    
    style MCP2515 fill:#FF6B35
    style TJA1050 fill:#3B82F6
    style Term fill:#10B981
```

### Pin Connections

| MCP2515 | TJA1050 | Description |
|---------|---------|-------------|
| TX      | TXD     | Transmit to transceiver |
| RX      | RXD     | Receive from transceiver |
| VCC     | VCC     | 5V power supply |
| GND     | GND     | Ground |
| -       | CAN_H   | High-speed CAN line |
| -       | CAN_L   | Low-speed CAN line |

## Baud Rate Calculation

For MCP2515 with 16MHz crystal:

```c
// Example: 500 kbps CAN baud rate
// BRP = 2, SJW = 1, PRSEG = 1, PHSEG1 = 3, PHSEG2 = 3

#define CNF1_VAL 0x03  // SJW=1, BRP=2
#define CNF2_VAL 0xAC  // BTLMODE=1, SAM=0, PRSEG=1, PHSEG1=3
#define CNF3_VAL 0x47  // SOF=0, WAKFIL=0, PHSEG2=3
```

Formula:
```
Baud Rate = Fosc / (2 × BRP × (1 + PRSEG + PHSEG1 + PHSEG2))
500kbps = 16MHz / (2 × 2 × (1 + 1 + 3 + 3))
```

## Common Issues & Solutions

### 1. No Communication
- ✅ Check termination resistors (120Ω at each end)
- ✅ Verify baud rate matches on all nodes
- ✅ Check CAN_H and CAN_L are not swapped

### 2. High Error Count
- ✅ Check wiring quality and length
- ✅ Ensure proper grounding
- ✅ Add common-mode choke if needed

### 3. Bus-Off State
- ✅ Reset controller or implement auto-recovery
- ✅ Check for dominant bit errors
- ✅ Verify transceiver is functioning

## Practice Exercise

Try implementing a simple CAN sender/receiver:

```c
#include <SPI.h>
#include <mcp_can.h>

MCP_CAN CAN(10);  // CS pin

void setup() {
  Serial.begin(115200);
  
  // Initialize CAN at 500kbps
  if (CAN.begin(MCP_500KBPS) == CAN_OK) {
    Serial.println("CAN initialized!");
  } else {
    Serial.println("CAN initialization failed!");
  }
}

void loop() {
  // Send CAN message
  unsigned char data[8] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08};
  CAN.sendMsgBuf(0x100, 0, 8, data);
  
  delay(100);
  
  // Check for incoming messages
  if (CAN_MSGAVAIL == CAN.checkReceive()) {
    unsigned char len;
    unsigned char buf[8];
    unsigned int canId;
    
    CAN.readMsgBuf(&canId, &len, buf);
    
    Serial.print("Received ID: ");
    Serial.println(canId, HEX);
  }
}
```

## Key Takeaways

1. CAN uses differential signaling for noise immunity
2. Lower ID = higher priority in bus arbitration
3. Termination resistors (120Ω) are critical for signal integrity
4. MCP2515 EFLG register helps diagnose communication issues
5. Proper baud rate configuration is essential for reliable communication

## Next Steps

- Study CAN FD (Flexible Data-rate) for higher bandwidth
- Learn about J1939 protocol stack for heavy vehicles
- Explore UDS (Unified Diagnostic Services) for diagnostics

---

**Ready to test your knowledge?** Take the quiz below! 🧠
