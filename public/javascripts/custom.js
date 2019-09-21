window.onload = async function() {
  let myChart;

  const startInput = document.getElementById("start-date");
  const endInput = document.getElementById("end-date");

  startInput.max = toDateInputValue({ current: true });

  startInput.value = toDateInputValue({
    current: false
  });

  endInput.max = toDateInputValue({ current: true });
  endInput.value = toDateInputValue({
    current: true
  });

  document.getElementById("set-date").onsubmit = updateChartDate;

  setCurrency();
  let data = await getData();
  createChart(data);
  minMax(data);
};

function createChart(data) {
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Bitcoint Price Index",
          data: Object.values(data),
          borderWidth: 1,
          borderColor: "powderblue",
          backgroundColor: "transparent"
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}

async function getData() {
  const currency = document.getElementById("select-currency").value;
  const inputs = document.getElementById("set-date").querySelectorAll("input");
  const startDate = inputs[0].value;
  const endDate = inputs[1].value;
  try {
    const response = await axios.get(
      `http://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endDate}&currency=${currency}`
    );
    return response.data.bpi;
  } catch (err) {
    console.log(err);
  }
}

async function updateChartDate(e) {
  e.preventDefault();
  let data = await getData(); //res.data.bpi
  myChart.data.labels = Object.keys(data);
  myChart.data.datasets[0].data = Object.values(data);
  myChart.update();
  minMax(data);
}

function setCurrency() {
  const select = document.getElementById("select-currency");
  data.forEach(country => {
    const option = document.createElement("option");
    option.value = country.currency;
    option.innerHTML = country.country;
    select.appendChild(option);
  });
  select.value = "BTC";
  select.onchange = updateChartDate;
}

function toDateInputValue(options) {
  const date = new Date();
  const days = date.getDate();
  const year = date.getFullYear();

  let month = date.getMonth();
  if (options.current) {
    month = date.getMonth() + 1;
  }

  month = month.toString().padStart(2, "0");
  if (month === "12") {
    month = "00";
  }
  return `${year}-${month}-${days}`;
}

function minMax(data) {
  const values = Object.values(data);
  const min = Math.min(...values); //spread operator
  const max = Math.max(...values);
  document.getElementById("min").innerText = min;
  document.getElementById("max").innerText = max;
}
