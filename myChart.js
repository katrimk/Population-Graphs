var currentChart;
document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';  
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);
        
    var response = await fetch(url);
        
    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}
        //extract the population counts from the data
function getValues(data) {
            // get the main time frame data only, not metadata; sort by year; select wanted data
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
            // puuttuu TypeErrorin kiinnisaanti, jos ei ole määritelty; myös rivi 30
        }
        // extract the year labels from the data
function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
            return labels;
        }
        // extract the country names from the data
    function getCountryName(data) {
        var countryName = data[1][0].country.value;
        return countryName;
        }

function renderChart(data, labels, countryName) {
    var ctx = document.getElementById('myChart').getContext('2d');
    
    if (currentChart) {
        //Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                borderColor: 'rgba(70, 189, 220, 1)', 
                backgroundColor: 'rgba(70, 189, 220, 0.2)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 1000
            }
        }
    });
}

        