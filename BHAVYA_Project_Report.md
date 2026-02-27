# BHAVYA: Advanced Wellness & Affective Computing Platform
## Technical Architecture & Implementation Report

---

### 1. Problem Statement

**The Silent Epidemic & The Monitoring Gap**

Mental health disorders, particularly depression and anxiety, are currently among the leading causes of disability worldwide. Despite their prevalence, effective management is hindered by a critical **Monitoring Gap**:

*   **Sporadic Assessment**: Clinical evaluations happen infrequently (weeks or months apart), missing daily fluctuations in mood and behavior.
*   **Subjectivity**: Self-reporting is often biased or dependent on the patient's state at the exact moment of reporting.
*   **Lack of Integration**: Biological, behavioral, and emotional data are rarely synthesized into a single cohesive risk profile in real-time.
*   **Reactive vs. Proactive**: Most systems wait for a crisis to occur rather than detecting early warning signs of emotional volatility or depressive patterns.

**The Challenge**: To build a secure, privacy-preserving, and intelligent platform that can continuously monitor emotional dynamics, detect subtle risk patterns using advanced AI, and provide actionable wellness interventions.

---

### 2. Proposed Solution: BHAVYA

**BHAVYA (Bio-Behavioral Holistic Analysis & Wellness Yielding Architecture)** is a comprehensive wellness ecosystem designed to bridge the gap between daily life and clinical oversight.

**Key Value Propositions:**
1.  **Affective Time-Series Engine**: Utilizes Neural Processing Unit (NPU) accelerated deep learning to map user inputs (text, video, questionnaire) into high-dimensional emotional vectors (EEV) and analyze them over time.
2.  **Temporal Dynamics Modeling**: Instead of just detecting "Sadness", the system detects *patterns* like "Emotional Volatility" or "Persistent Depressive Inertia" using LSTM networks.
3.  **Holistic Risk Scoring**: Combines psychometric data (check-ins), behavioral logs (journaling), and AI inference into a unified Risk Index.
4.  **Immersive User Experience**: A "Calm Technology" design approach using glassmorphism and smooth animations to reduce cognitive load and anxiety.

---

### 3. System Architecture

The platform follows a modern **Client-Server Micro-Modular Architecture**.

#### 3.1 High-Level Diagram
```mermaid
graph TD
    Client[React Client (SPA)] <-->|REST API (JSON)| API_Gateway[FastAPI Gateway]
    
    subgraph "Backend Services"
        API_Gateway --> Auth[Auth Service (JWT)]
        API_Gateway --> User[User Profile Service]
        API_Gateway --> Journal[Journaling Service]
        API_Gateway --> Affective[Affective Engine (AI)]
        API_Gateway --> Insights[Risk & Insights Service]
    end
    
    subgraph "Data Layer"
        Affective --> NPU[NPU Interface (Simulated)]
        Affective --> LSTM[Temporal Model (PyTorch)]
        Services --> DB[(SQL Database)]
    end
```

#### 3.2 Component Breakdown

**A. Frontend (client-side)**
*   **Architecture**: Single Page Application (SPA).
*   **State Management**: React Hooks (local state) + Context API for Auth.
*   **Visualization**: Real-time charting of emotional timelines using Recharts.
*   **Interaction**: Modal-driven workflows (e.g., Daily Check-ins) to maintain context.

**B. Backend (server-side)**
*   **Architecture**: Monolithic codebase with strict modular separation (Services Pattern).
*   **API Design**: RESTful standard with Pydantic schemas for strict data validation.
*   **Async/Await**: extensive use of Python's `asyncio` for non-blocking I/O operations.

**C. The Affective Engine (Core Innovation)**
*   **Vector Space**: Maps inputs to a **15-dimensional EEV (Ecological Emotion Vector)** space (e.g., Amusement, Anxiety, Contentment, etc.).
*   **NPU Interface**: A dedicated hardware abstraction layer designed to offload vector extraction to Neural Processing Units (simulated in current dev).
*   **Temporal Model**: An **LSTM (Long Short-Term Memory)** network that takes a sequence of emotion vectors (T=30) and classifies the *dynamics* of the user's state.

---

### 4. Technology Stack

#### Frontend
| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | **React 18** + **Vite** | High performance, component reusability, fast dev server. |
| **Language** | **TypeScript** | Type safety prevents runtime errors in complex logic. |
| **Styling** | **Tailwind CSS** | Rapid UI development, consistency, dark mode support. |
| **Animation** | **Framer Motion** | Physics-based animations for a "premium" feel. |
| **Charting** | **Recharts** | Declarative D3-based charting for React. |

#### Backend
| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | **FastAPI** | Fastest Python web framework, native async support, auto-docs. |
| **Language** | **Python 3.9+** | Dominant language for AI/ML integration. |
| **ORM** | **SQLAlchemy 2.0** | Robust SQL abstraction and schema management. |
| **Validation** | **Pydantic v2** | Extremely fast data validation and serialization. |

#### AI & Data Science
| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Deep Learning** | **PyTorch** | Dynamic graph generation, excellent for RNN/LSTM models. |
| **Math** | **NumPy** | High-performance vector/matrix operations. |
| **Inference** | **Custom NPU Interface** | Simulates hardware-accelerated edge inference. |

---

### 5. Programming Approach & Methodologies

**1. Service-Oriented Logic:**
Business logic is decoupled from API routes. The `services/` directory contains core logic (e.g., `affective_engine/`, `optimization/`), while `app/api/` handles request/response processing.

**2. Type Safety & Validation:**
Strict typing is enforced across the full stack. Pydantic models in Python mirror TypeScript interfaces in the frontend, ensuring data consistency (e.g., `UserCreate`, `DailyCheckIn`).

**3. Test-Driven Development (TDD) Hybrid:**
Critical paths (Affective Analysis, Check-in Logic) are tested via unit scripts (e.g., `test_affective_api.py`) to ensure stability before UI integration.

**4. Error Handling:**
Global exception handlers in FastAPI ensure that server-side errors (500s) provide structured error logs without crashing the service, while the frontend implements `try/catch` boundaries to degrade gracefully.

---

### 6. Future Roadmap
*   **Video Integration**: Connect NPU Interface to real-time webcam feed for facial micro-expression analysis.
*   **Federated Learning**: Train personalized models on the user's device to preserve privacy.
*   **Wearable Sync**: Ingest heart rate variability (HRV) data to correlate physiological stress with reported anxiety.
