# AI Travel Guardian: Risk-Aware Multi-Agent Travel Planning System

##  Overview

AI Travel Guardian is an autonomous multi-agent travel recovery system designed to help travelers handle unexpected disruptions such as flight cancellations, delays, and severe weather conditions.
It uses a multi-agent architecture to mimic intelligent decision-making under uncertainty. And this collaborate to monitor travel conditions, make recovery decisions, and provide alternative travel plans.

##  Problem Statement

Travel disruptions often leave travelers stressed and uncertain about the next best action. Traditional travel applications provide information but rarely take proactive action.
This project builds an adaptive AI agent system that responds dynamically to changing conditions.

##   Objectives

  1. Build a modular multi-agent travel planning system.
  2. Detect travel disruptions through simulated monitoring.
  3. Evaluate travel risks using a scoring mechanism.
  4. Recommend the safest travel decision.
  5. Provide transparent and explainable AI reasoning.

##  Multi-Agent Architecture

The multi-agent architecture separates planning, monitoring, decision-making, and execution into independent components. This modular design improves maintainability, scalability, and allows each agent to focus on a specific responsibility.

### Planner Agent
Creates the initial travel itinerary based on the user's source and destination.
### Monitor Agent
Monitors travel conditions and detects disruptions such as flight cancellations.
### Decision Agent
Evaluates the disruption and determines the best recovery strategy.

####  Decision Flow

**Step 1: Monitoring** Collects system state:
                        flight_status
                        weather
                        risk_score

**Step 2: Route Scoring** Example route scores:
                            Singapore → 8
                            Dubai → 6
                            Doha → 7

**Step 3: Decision Logic**
                          Risk Level
                          Action
                          Low Risk
                          Proceed normally
                          Medium Risk
                          Proceed via best route
                          High Risk 
                          Delay trip

**Step 4: Execution** Final decision is executed with:
                          selected route
                          explanation
                          confidence score

*Each decision includes:*
Best route selection
Risk reasoning
Decision tree path
Confidence score
Human-readable explanation
This ensures transparent AI decision-making.

### Execution Agent
Formats and presents the final recovery plan to the traveler.

##  Project Structure

TRAVEL_AGENT

- agents/
  - planner.py
  - monitor.py
  - decision.py
  - execution.py
- tools/
  - flight_api.py
  - weather_api.py
- main.py
- config.py
- README.md

##  Current Workflow

→ User Request
→ Initialize state
→ Planner sets route
→ Monitor simulates conditions
→ Route Scorer evaluates and ranks all routes based on risk and efficiency
→ Decision agent calculates scores
→ Execution agent returns 
→ Final output

##  Technologies Used

This project is developed using lightweight Python-based architecture with a focus on rule-driven multi-agent simulation and sequential decision pipelines.
**Core Language**
Python
**System Design**
Multi-Agent System Architecture (Planner, Monitor, Decision, Execution agents)
Sequential Pipeline Processing
State-Based Data Flow using Python dictionaries
**Logic & Decision Making**
Rule-Based Decision System (if-else logic)
Risk Scoring Mechanism (penalty-based scoring model)
Greedy selection strategy for optimal route selection
**Simulation Components**
Randomized environment simulation using Python random module
Flight status simulation
Weather condition simulation

##  Key Features

Multi-agent AI architecture
Risk-aware decision engine
Dynamic route optimization
Explainable AI reasoning
Confidence scoring system
Dual scenario simulation (normal + disruption)

## Scenario Handling

The system uses different scenarios by modifying the initial state. Each run processes the state independently, and outputs change based on simulated conditions like weather and flight status.

##  Disruption Handling (Key Highlight)

The system handles real-world failures such as:
*Example Scenario:*
Flight cancelled
Storm detected
Risk score = 18

🧠 **Output:**
Decision → Delay Trip
Reason → High risk threshold exceeded
Decision Tree → HIGH_RISK → DELAY

##  Example Outputs

🟢 Normal Scenario
Risk Score: 4
Decision: Proceed via best route
Selected Route: Singapore
Confidence: 0.38
🔴 Disruption Scenario
Risk Score: 18
Decision: Delay Trip
Reason: High-risk conditions detected
Decision Tree: HIGH_RISK → DELAY

## Current Limitations

1. Uses simulated flight and weather data.
2. Rule-based decision logic instead of machine learning.
3. Designed as a prototype for demonstrating autonomous AI workflows.

##  Future Improvements

Real-time flight API integration
Weather API integration
ML-based risk prediction
Reinforcement learning for decision optimization
Probabilistic confidence modeling

##  Conclusion

This project demonstrates a multi-agent AI system capable of making adaptive travel decisions under uncertainty.
It combines:
Risk analysis
Utility optimization
Explainable AI
Scenario-based reasoning

##  Final Note

This system is a prototype demonstrating how multi-agent systems can coordinate under uncertainty to produce transparent, risk-aware travel decisions.

to run in terminal : > python main.py
