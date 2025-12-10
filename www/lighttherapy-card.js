class LighttherapyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._moods = [];
    this._schemes = [];
    this._selectedMood = null;
    this._selectedScheme = null;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
    this._render();
    this._loadMoods();
  }

  async _loadMoods() {
    try {
      // Get the add-on URL - adjust based on your HA setup
      const baseUrl = this._config.addon_url || 'http://homeassistant.local:8269';
      const response = await fetch(`${baseUrl}/moods`);
      const data = await response.json();
      this._moods = data.moods || [];
      this._render();
    } catch (error) {
      console.error('Error loading moods:', error);
    }
  }

  async _loadSchemes(mood) {
    try {
      const baseUrl = this._config.addon_url || 'http://homeassistant.local:8269';
      const response = await fetch(`${baseUrl}/moods/${mood}`);
      const data = await response.json();
      this._schemes = data.schemes || [];
      this._selectedMood = mood;
      this._selectedScheme = null;
      this._render();
    } catch (error) {
      console.error('Error loading schemes:', error);
    }
  }

  async _applyScheme() {
    if (!this._selectedMood || !this._selectedScheme) {
      alert('Please select both a mood and a scheme');
      return;
    }

    try {
      const baseUrl = this._config.addon_url || 'http://homeassistant.local:8269';
      const response = await fetch(`${baseUrl}/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: this._selectedMood,
          scheme: this._selectedScheme
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Applied: ${this._selectedMood} - ${this._selectedScheme}`);
        this._loadActive();
      }
    } catch (error) {
      console.error('Error applying scheme:', error);
    }
  }

  async _loadActive() {
    try {
      const baseUrl = this._config.addon_url || 'http://homeassistant.local:8269';
      const response = await fetch(`${baseUrl}/active`);
      const data = await response.json();
      
      // Update display with active scheme
      const activeDiv = this.shadowRoot.querySelector('.active-scheme');
      if (activeDiv && data.mood && data.scheme) {
        activeDiv.innerHTML = `
          <div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 4px;">
            <strong>Active:</strong> ${data.mood} - ${data.scheme}
            <div style="display: flex; gap: 5px; margin-top: 5px;">
              ${data.colors.map(color => `
                <div style="width: 40px; height: 40px; background: ${color}; border: 1px solid #ccc;"></div>
              `).join('')}
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading active scheme:', error);
    }
  }

  _createBulbIcon(color) {
    return `
      <svg class="bulb-icon" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bulb-gradient-${color.replace('#', '')}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this._darkenColor(color, 20)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <!-- Bulb glass -->
        <ellipse cx="12" cy="10" rx="8" ry="10" fill="url(#bulb-gradient-${color.replace('#', '')})" stroke="#333" stroke-width="0.5" opacity="0.9"/>
        <!-- Bulb base -->
        <rect x="9" y="19" width="6" height="3" fill="#888" stroke="#333" stroke-width="0.5"/>
        <rect x="8.5" y="22" width="7" height="2" fill="#777" stroke="#333" stroke-width="0.5"/>
        <rect x="9" y="24" width="6" height="2" fill="#666" stroke="#333" stroke-width="0.5"/>
        <!-- Shine effect -->
        <ellipse cx="9" cy="8" rx="2.5" ry="3" fill="white" opacity="0.4"/>
      </svg>
    `;
  }

  _darkenColor(color, percent) {
    // Simple color darkening function
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
  }

  _render() {
    const title = this._config.title || 'Lighttherapy PoC';
    
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          padding: 16px;
          background: var(--ha-card-background, white);
          border-radius: var(--ha-card-border-radius, 4px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14));
        }
        .title {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 16px;
        }
        select, button {
          width: 100%;
          padding: 8px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        button {
          background: #03a9f4;
          color: white;
          cursor: pointer;
          border: none;
        }
        button:hover {
          background: #0288d1;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .mood-preview {
          margin: 16px 0;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }
        .mood-preview-title {
          font-size: 0.9em;
          font-weight: bold;
          margin-bottom: 12px;
          color: #666;
        }
        .mood-preview-schemes {
          display: flex;
          gap: 16px;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .mood-preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .bulb-container {
          display: flex;
          gap: 4px;
        }
        .bulb-icon {
          width: 32px;
          height: 48px;
        }
        .scheme-name {
          font-size: 0.8em;
          text-align: center;
          color: #555;
        }
        .scheme-list {
          margin-top: 10px;
        }
        .scheme-item {
          padding: 8px;
          margin: 4px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .scheme-item:hover {
          background: #f5f5f5;
        }
        .scheme-item.selected {
          background: #e3f2fd;
          border-color: #03a9f4;
        }
        .color-preview {
          display: flex;
          gap: 4px;
        }
        .color-box {
          width: 24px;
          height: 24px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }
      </style>
      <div class="card">
        <div class="title">${title}</div>
        
        <label for="mood-select">Select Mood:</label>
        <select id="mood-select">
          <option value="">-- Choose a mood --</option>
          ${this._moods.map(mood => `
            <option value="${mood}" ${mood === this._selectedMood ? 'selected' : ''}>
              ${mood}
            </option>
          `).join('')}
        </select>
        
        ${this._schemes.length > 0 ? `
          <div class="mood-preview">
            <div class="mood-preview-title">Color Schemes for ${this._selectedMood}</div>
            <div class="mood-preview-schemes">
              ${this._schemes.map(scheme => `
                <div class="mood-preview-item">
                  <div class="bulb-container">
                    ${scheme.colors.map(color => this._createBulbIcon(color)).join('')}
                  </div>
                  <div class="scheme-name">${scheme.name}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="scheme-list">
            <label>Select Scheme:</label>
            ${this._schemes.map((scheme, idx) => `
              <div class="scheme-item ${scheme.name === this._selectedScheme ? 'selected' : ''}" 
                   data-scheme="${scheme.name}">
                <span>${scheme.name}</span>
                <div class="color-preview">
                  ${scheme.colors.map(color => `
                    <div class="color-box" style="background: ${color};"></div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <button id="apply-btn" ${!this._selectedScheme ? 'disabled' : ''}>
          Apply Scheme
        </button>
        
        <div class="active-scheme"></div>
      </div>
    `;

    // Add event listeners
    const moodSelect = this.shadowRoot.querySelector('#mood-select');
    if (moodSelect) {
      moodSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          this._loadSchemes(e.target.value);
        } else {
          this._schemes = [];
          this._selectedMood = null;
          this._selectedScheme = null;
          this._render();
        }
      });
    }

    const schemeItems = this.shadowRoot.querySelectorAll('.scheme-item');
    schemeItems.forEach(item => {
      item.addEventListener('click', () => {
        this._selectedScheme = item.dataset.scheme;
        this._render();
      });
    });

    const applyBtn = this.shadowRoot.querySelector('#apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this._applyScheme();
      });
    }

    // Load active scheme on render
    if (this._moods.length > 0) {
      this._loadActive();
    }
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('lighttherapy-card', LighttherapyCard);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'lighttherapy-card',
  name: 'Lighttherapy Card',
  description: 'A card for selecting light therapy moods and schemes'
});
