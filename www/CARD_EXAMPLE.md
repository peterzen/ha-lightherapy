# Lovelace Card Example

Add this card configuration to your Home Assistant Lovelace dashboard.

## Basic Configuration

```yaml
type: custom:lighttherapy-card
title: Lighttherapy PoC
```

## Full Configuration

```yaml
type: custom:lighttherapy-card
title: Light Therapy Control
addon_url: http://homeassistant.local:8269
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | "Lighttherapy PoC" | Card title |
| `addon_url` | string | "http://homeassistant.local:8269" | URL to the add-on API |

## Installation Steps

1. Copy `www/lighttherapy-card.js` to `/config/www/` directory
2. Add the resource in Lovelace:
   - Settings → Dashboards → Resources
   - Add Resource: `/local/lighttherapy-card.js`
   - Type: JavaScript Module
3. Add the card to your dashboard using one of the configurations above

## Usage

1. Select a mood from the dropdown (Relax, Focus, or Energy)
2. Click on a scheme to select it (shows color preview)
3. Press "Apply Scheme" button to activate
4. Active scheme displays at the bottom with color swatches
