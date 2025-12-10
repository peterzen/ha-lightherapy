# HA-Lighttherapy Add-on (PoC)

A proof-of-concept Home Assistant Add-on that provides a simple API for selecting light therapy moods and color schemes.

## Features

- **3 Moods**: Relax, Focus, Energy
- **3 Schemes per Mood**: Each with unique color palettes
- **RESTful API**: Simple HTTP endpoints for mood/scheme selection
- **Custom Lovelace Card**: Interactive UI for scheme selection
- **No External Dependencies**: Uses only Python standard library

## Installation

### Method 1: Local Add-on Repository

1. **Clone or download this repository** to your Home Assistant machine.

2. **Copy the add-on folder** to your Home Assistant add-ons directory:
   ```bash
   # If using Home Assistant OS or Supervised:
   cp -r ha-lighttherapy /usr/share/hassio/addons/local/
   
   # Or if running in Docker:
   cp -r ha-lighttherapy /path/to/your/addons/
   ```

3. **Restart the Supervisor** (or reload add-ons):
   - Go to **Settings** → **Add-ons** → **Add-on Store** (three dots menu)
   - Click **Reload**

4. **Install the add-on**:
   - The "Lighttherapy PoC" add-on should now appear in your local add-ons
   - Click on it and press **Install**

5. **Start the add-on**:
   - After installation, press **Start**
   - Optionally enable **Start on boot** and **Watchdog**

### Method 2: Custom Repository (Advanced)

If you've published this to a GitHub repository:

1. Go to **Settings** → **Add-ons** → **Add-on Store** (three dots menu)
2. Click **Repositories**
3. Add your repository URL: `https://github.com/yourusername/ha-lightherapy`
4. Install the add-on from the store

## API Endpoints

Once the add-on is running, it exposes the following endpoints on port **8269**:

### GET /moods
Returns a list of available moods.

**Response:**
```json
{
  "moods": ["Relax", "Focus", "Energy"]
}
```

### GET /moods/{mood_name}
Returns all schemes for a specific mood.

**Example:** `GET /moods/Relax`

**Response:**
```json
{
  "mood": "Relax",
  "schemes": [
    { "name": "Sunset Soft", "colors": ["#FFB199", "#FF8C66", "#CC6E4A"] },
    { "name": "Warm Fade", "colors": ["#FFCC99", "#FFB266", "#E6994D"] },
    { "name": "Candle Glow", "colors": ["#FFDFB3", "#FFCC80", "#E6B873"] }
  ]
}
```

### POST /select
Selects and activates a mood/scheme combination.

**Request Body:**
```json
{
  "mood": "Relax",
  "scheme": "Sunset Soft"
}
```

**Response:**
```json
{
  "success": true,
  "active": {
    "mood": "Relax",
    "scheme": "Sunset Soft",
    "colors": ["#FFB199", "#FF8C66", "#CC6E4A"]
  }
}
```

### GET /active
Returns the currently active mood and scheme.

**Response:**
```json
{
  "mood": "Relax",
  "scheme": "Sunset Soft",
  "colors": ["#FFB199", "#FF8C66", "#CC6E4A"]
}
```

## Using the Custom Lovelace Card

### 1. Install the Card

1. **Copy the card file** to your `www` folder:
   ```bash
   cp www/lighttherapy-card.js /config/www/
   ```

2. **Add the resource** to your Lovelace configuration:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **Add Resource**
   - URL: `/local/lighttherapy-card.js`
   - Resource type: **JavaScript Module**

### 2. Add the Card to Your Dashboard

Add this to your Lovelace dashboard (edit in YAML mode):

```yaml
type: custom:lighttherapy-card
title: Lighttherapy PoC
addon_url: http://homeassistant.local:8269
```

**Configuration Options:**
- `title`: (optional) Custom title for the card
- `addon_url`: (optional) URL to the add-on API. Defaults to `http://homeassistant.local:8269`

### 3. Using the Card

1. Select a **mood** from the dropdown
2. Choose a **scheme** from the displayed options (shows color preview)
3. Click **Apply Scheme** to activate it
4. The active scheme will be displayed at the bottom with color swatches

## Testing the API

You can test the API using curl or any HTTP client:

```bash
# Get list of moods
curl http://homeassistant.local:8269/moods

# Get schemes for "Focus" mood
curl http://homeassistant.local:8269/moods/Focus

# Select a scheme
curl -X POST http://homeassistant.local:8269/select \
  -H "Content-Type: application/json" \
  -d '{"mood": "Energy", "scheme": "Citrus Pop"}'

# Get active scheme
curl http://homeassistant.local:8269/active
```

## Mood & Scheme Reference

### Relax
- **Sunset Soft**: Soft orange tones (#FFB199, #FF8C66, #CC6E4A)
- **Warm Fade**: Warm peachy colors (#FFCC99, #FFB266, #E6994D)
- **Candle Glow**: Gentle candlelight hues (#FFDFB3, #FFCC80, #E6B873)

### Focus
- **Cool Mint**: Refreshing mint greens (#A6FFF2, #66FFE5, #33CCB8)
- **Aqua Edge**: Cool aqua blues (#99E6FF, #66CCFF, #3399CC)
- **Blue Steel**: Deep focus blues (#99B3FF, #668CFF, #335FCC)

### Energy
- **Citrus Pop**: Bright yellows (#FFEE99, #FFDD55, #FFCC00)
- **Vivid Trio**: Energetic reds (#FF6666, #FF3333, #CC0000)
- **Tropical**: Vibrant pinks (#FF99CC, #FF6699, #FF3366)

## Architecture

```
ha-lighttherapy/
├── config.yaml              # Add-on configuration
├── Dockerfile               # Container build instructions
├── run.sh                   # Startup script
├── data/
│   └── schemes.json         # Hardcoded mood/scheme data
└── rootfs/
    └── usr/bin/
        └── lighttherapy-server  # Python HTTP server
```

## Limitations (PoC)

This is a **proof of concept** with the following limitations:

- ✓ Hardcoded schemes (not editable via UI)
- ✓ No persistent storage (selections reset on restart)
- ✓ No actual light control integration
- ✓ Basic error handling
- ✓ No authentication

## Future Enhancements

Potential improvements for a production version:

- [ ] Integration with Home Assistant light entities
- [ ] Persistent storage of selections
- [ ] Custom scheme creation via UI
- [ ] Advanced color mixing and transitions
- [ ] Scene creation and automation support
- [ ] Multi-room/zone support
- [ ] Schedule-based mood changes

## Troubleshooting

### Add-on won't start
- Check the add-on logs in the Home Assistant UI
- Ensure port 8269 is not in use by another service
- Verify Python 3 is available in the container

### Card shows errors
- Verify the add-on is running
- Check the `addon_url` configuration matches your setup
- Open browser console to see detailed error messages
- Ensure CORS is working (the server includes CORS headers)

### API returns 404
- Confirm you're using the correct endpoint paths
- Check add-on logs for request information
- Verify the add-on started successfully

## Support

This is a proof-of-concept add-on created for demonstration purposes. For issues or feature requests, please open an issue on the GitHub repository.

## License

MIT License - Feel free to modify and extend as needed.

## Credits

Built using the official Home Assistant add-on template:
https://github.com/home-assistant/addons-example
