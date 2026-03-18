class StockCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get styles() {
    return `
      :host {
        --background-color: #f0f4f8;
        --card-background: rgba(255, 255, 255, 0.9);
        --primary-color: #0052ff;
        --primary-hover-color: #0048e0;
        --text-color: #1a1a1a;
        --label-color: #5c5c5c;
        --border-color: #dcdcdc;
        --success-color: #28a745;
        --danger-color: #dc3545;
        --shadow-color-light: rgba(0, 82, 255, 0.1);
        --shadow-color-dark: rgba(0, 0, 0, 0.1);
      }
      
      .calculator-wrapper {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 var(--shadow-color-dark), 0 4px 12px 0 var(--shadow-color-light);
          padding: 2.5rem;
      }

      .calculator-title {
        text-align: center;
        color: var(--primary-color);
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 2.5rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .form-group {
        position: relative;
      }
      
      .form-group i {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--label-color);
          font-size: 0.9em;
      }

      label {
        display: block;
        color: var(--label-color);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.9rem 0.9rem 0.9rem 2.5rem; /* left padding for icon */
        border: 1px solid var(--border-color);
        border-radius: 10px;
        font-size: 1rem;
        background-color: #fdfdfd;
        transition: border-color 0.3s, box-shadow 0.3s;
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 4px var(--shadow-color-light);
      }

      .calculate-btn {
        width: 100%;
        padding: 1.1rem;
        background: linear-gradient(45deg, var(--primary-color), #007bff);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.3s;
        margin-top: 1.5rem;
        box-shadow: 0 4px 15px 0 rgba(0, 123, 255, 0.3);
      }

      .calculate-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px 0 rgba(0, 123, 255, 0.4);
      }

      .result-section {
        margin-top: 2.5rem;
        padding-top: 2.5rem;
        border-top: 1px solid var(--border-color);
      }

      .result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.2rem 0;
        font-size: 1.1rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .result-item:last-child {
        border-bottom: none;
      }
      
      .result-item span {
        color: var(--label-color);
      }

      .result-item strong {
        color: var(--text-color);
        font-size: 1.4rem;
        font-weight: 600;
      }
      
      .result-item strong.positive {
        color: var(--success-color);
      }
      
      .result-item strong.negative {
        color: var(--danger-color);
      }

      @media (min-width: 600px) {
        .form-grid {
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .full-width {
            grid-column: 1 / -1;
        }
      }
      
      @media (max-width: 480px) {
        .calculator-wrapper {
          padding: 1.5rem;
        }
        .calculator-title {
          font-size: 1.8rem;
          margin-bottom: 2rem;
        }
        .result-item strong {
            font-size: 1.2rem;
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${StockCalculator.styles}</style>
      <div class="calculator-wrapper">
        <h1 class="calculator-title">주식 물타기 계산기</h1>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="current-shares">현재 보유 주식 수</label>
            <i class="fa-solid fa-layer-group"></i>
            <input type="number" id="current-shares" placeholder="예: 10">
          </div>
          <div class="form-group">
            <label for="current-price">현재 평균 단가</label>
            <i class="fa-solid fa-dollar-sign"></i>
            <input type="number" id="current-price" placeholder="예: 10,000">
          </div>
          <div class="form-group">
            <label for="new-shares">추가 매수 주식 수</label>
            <i class="fa-solid fa-cart-plus"></i>
            <input type="number" id="new-shares" placeholder="예: 5">
          </div>
          <div class="form-group">
            <label for="purchase-price">매수 / 현재가</label>
            <i class="fa-solid fa-chart-line"></i>
            <input type="number" id="purchase-price" placeholder="예: 8,000">
          </div>
          
          <button class="calculate-btn full-width">계산하기</button>
        </div>
        
        <div class="result-section">
          <div class="result-item">
            <span>총 보유 주식</span>
            <strong id="total-shares">0 주</strong>
          </div>
          <div class="result-item">
            <span>최종 평균 단가</span>
            <strong id="final-avg-price">0 원</strong>
          </div>
          <div class="result-item">
            <span>추가 매수 금액</span>
            <strong id="additional-investment">0 원</strong>
          </div>
          <div class="result-item">
            <span>총 투자 금액</span>
            <strong id="total-investment">0 원</strong>
          </div>
          <div class="result-item">
            <span>수익률</span>
            <strong id="rate-of-return">0 %</strong>
          </div>
          <div class="result-item">
            <span>평가손익</span>
            <strong id="unrealized-pl">0 원</strong>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.calculate-btn').addEventListener('click', () => this.calculate());
  }

  calculate() {
    const currentShares = parseFloat(this.shadowRoot.getElementById('current-shares').value) || 0;
    const currentPrice = parseFloat(this.shadowRoot.getElementById('current-price').value) || 0;
    const newShares = parseFloat(this.shadowRoot.getElementById('new-shares').value) || 0;
    const purchasePrice = parseFloat(this.shadowRoot.getElementById('purchase-price').value) || 0;

    if (currentShares <= 0 || currentPrice <= 0) {
        alert("현재 보유 주식 수와 평균 단가를 정확히 입력해주세요.");
        return;
    }
    
    if (newShares <= 0 || purchasePrice <= 0) {
        alert("추가 매수 주식 수와 매수/현재가를 정확히 입력해주세요.");
        return;
    }

    const totalShares = currentShares + newShares;
    const additionalInvestment = newShares * purchasePrice;
    const totalInvestment = (currentShares * currentPrice) + additionalInvestment;
    const finalAvgPrice = totalInvestment / totalShares;

    this.shadowRoot.getElementById('total-shares').textContent = `${totalShares.toLocaleString()} 주`;
    this.shadowRoot.getElementById('final-avg-price').textContent = `${Math.round(finalAvgPrice).toLocaleString()} 원`;
    this.shadowRoot.getElementById('additional-investment').textContent = `${Math.round(additionalInvestment).toLocaleString()} 원`;
    this.shadowRoot.getElementById('total-investment').textContent = `${Math.round(totalInvestment).toLocaleString()} 원`;
    
    const marketPrice = purchasePrice; // Use purchase price as market price
    const rateOfReturn = ((marketPrice - finalAvgPrice) / finalAvgPrice) * 100;
    const unrealizedPL = (marketPrice - finalAvgPrice) * totalShares;

    const rateOfReturnEl = this.shadowRoot.getElementById('rate-of-return');
    const unrealizedPLEl = this.shadowRoot.getElementById('unrealized-pl');

    rateOfReturnEl.textContent = `${rateOfReturn.toFixed(2)} %`;
    unrealizedPLEl.textContent = `${Math.round(unrealizedPL).toLocaleString()} 원`;

    [rateOfReturnEl, unrealizedPLEl].forEach(el => {
        el.classList.remove('positive', 'negative');
        if (unrealizedPL > 0) {
            el.classList.add('positive');
        } else if (unrealizedPL < 0) {
            el.classList.add('negative');
        }
    });
  }
}

customElements.define('stock-calculator', StockCalculator);
