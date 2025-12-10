# HA-Lighttherapy Add-on

A proof-of-concept Home Assistant Add-on for light therapy mood and color scheme selection.

## Quick Start

This repository contains:

- **`ha-lighttherapy/`** - The Home Assistant add-on
- **`www/`** - Custom Lovelace card for the dashboard

See the [add-on README](ha-lighttherapy/README.md) for detailed installation and usage instructions.

## What is This?

HA-Lighttherapy is a minimal Home Assistant add-on that provides:

- API for selecting light therapy moods (Relax, Focus, Energy)
- Each mood has 3 color schemes with preset palettes
- RESTful API on port 8269
- Custom Lovelace card for easy scheme selection

This is a **proof of concept** - it doesn't control actual lights yet, just provides the API infrastructure.

## Installation

1. Copy the `ha-lighttherapy` folder to your Home Assistant add-ons directory
2. Restart the Supervisor and install the add-on
3. Start the add-on
4. Install the custom card from `www/lighttherapy-card.js`

Full instructions: [ha-lighttherapy/README.md](ha-lighttherapy/README.md)