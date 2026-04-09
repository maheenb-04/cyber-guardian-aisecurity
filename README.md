# Cyber Guard AI

An AI-powered cybersecurity threat detection tool built with React, TypeScript, Supabase, and large language model prompt engineering.

## Live App

https://cyber-guardian-aisecurity.lovable.app/

## What It Does

Cyber Guard AI analyzes URLs, email content, and suspicious messages to detect phishing, social engineering, URL spoofing, and other common cyber threats. It returns a clear threat classification with an explanation of the specific red flags detected.

## Tech Stack

- React with TypeScript
- Vite
- Tailwind CSS with shadcn/ui
- Supabase for backend and edge functions
- AI prompt engineering for threat classification

## Prompt Engineering Approach

The core of this project is a structured prompt that instructs the language model to evaluate input across several threat categories simultaneously, return a severity classification, identify specific red flags present in the input, and explain its reasoning in plain language accessible to non-technical users.

## Local Development

Clone the repo and install dependencies with `npm install`. Copy `.env.example` to `.env` and add your Supabase project URL and anon key. Run the development server with `npm run dev`.

## Project Context

Built as a capstone project for an AI prompt engineering accelerator program.
