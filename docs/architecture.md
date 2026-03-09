# 🏗️ System Architecture: AI-Powered Parametric Insurance

This document outlines the technical structure of the platform, detailing how the React frontend, Spring Boot backend, and Python AI engine interact to automate insurance payouts.

## 1. High-Level Flow Diagram
The system uses a **Parametric Trigger Model**. When external APIs (Weather/AQI) report data exceeding a threshold, the system automatically triggers the payout logic.

```mermaid
graph TD
    subgraph "Client Layer"
        A[React Web App] -->|HTTPS/JSON| B[Spring Boot API]
    end

    subgraph "Logic & Storage Layer"
        B <--> C[(MySQL Database)]
        B -->|Analysis Request| D[Python AI Engine]
        D -->|Risk Score/Fraud Check| B
    end

    subgraph "Integration Layer"
        B <--> E[OpenWeather API]
        B <--> F[AQICN Pollution API]
        B -->|Trigger Payout| G[Razorpay Sandbox]
    end
