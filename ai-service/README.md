# AI Farmer Assistant — AI Service

This directory contains the artificial intelligence service for the AI Farmer Assistant platform.

## Purpose

The AI service will provide computer vision capabilities for detecting crop diseases from images uploaded by farmers.

## Current MVP

The first version focuses on tomato disease detection.

### Initial disease classes

- Healthy
- Early Blight
- Late Blight
- Uncertain

## Architecture

The AI service will communicate with the main Node.js backend.

```text
React PWA
    ↓
Node.js / Express
    ↓
AI Gateway
    ↓
AI Service
    ↓
Computer Vision Model
    ↓
Disease Prediction