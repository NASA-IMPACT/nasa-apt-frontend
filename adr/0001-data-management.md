# 1. Data management

- Status: accepted
- Deciders: @danielfdsilva
- Date: 2021-03-17

## Context and Problem Statement

We need a way to organize the data layer of APT, which is coming from a REST api.
We need to store and access a list of ATBDs; each single ATBD and its content which include several fields, references and contacts; the list of contacts and each individual contact.

## Decision Drivers

- Simple to reason about
- Simple to use

## Considered Options

- Fetching on each component
- Centralized data with React context
- Centralized data with Redux

## Decision Outcome

Chosen "Centralized data with React context" to avoid adding other dependencies and tech stacks to learn. It builds on top of practices used with Reduxeed so the learning curve shouldn't be too bad.

### Positive Consequences

- Stack is simplified, being focused only on one thing.
- Easy to change because is locally scoped to this project.

### Negative Consequences

- Need to maintain the code and build new features as needed
- Being internally developed, documentation may lack.

## Pros and Cons of the Options

### Fetching on each component

- 💚 Simple, and easy to understand exactly what is being requested
- 🚩 Lot of unnecessary requests when the same data is used in different places
- 🚩 No central data state

### Centralized data with React context

- 💚 No additional dependencies outside of React
- 💚 Centralized data management
- 🚩 All the logic has to be created by ourselves

### Centralized data with Redux

- 💚 Very powerful with tested data handling practices
- 💚 Centralized data management
- 💚 Exiting toolkits and modules make it easy to write redux code
- 🚩 Requires knowing and understanding Redux
