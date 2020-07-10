function init(){
//Read samples.json
    d3.json("data/samples.json").then((importedData) => {

        let dropdownOptions = importedData.names 
        let selectedOption = d3.select("#selDataset");


        dropdownOptions.forEach(function(name){
            selectedOption.append("option")
            .text(name)
            .property("value");
        })

    })   
// Use the first subject ID from the names to build initial plots
updateMetadata(940)
bubbleChart(940)
barPlot(940)
}

d3.selectAll("#selDataset").on("change", getData)

// create the function for the change event
function getData() {

    let selectedID = d3.select("#selDataset").property("value");
    barPlot(selectedID)
    updateMetadata(selectedID)
    bubbleChart(selectedID)
}

function updateMetadata(selectedID) {
    d3.json("data/samples.json").then((data) => {
        let metadata = data.metadata;
        // filter meta data info by id
        let filterArray = metadata.filter(el => el.id == selectedID);
        let result = filterArray[0];
        // select demographic panel to put data
        let metaPanel = d3.select("#sample-metadata");
        // empty the demographic info panel each time before getting new id info
        metaPanel.html("");
        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach(([key, value]) => {
            metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
    });
  }


function barPlot(selectedID) {

    d3.json("data/samples.json").then(function(data){
        let samples = data.samples;
        let filterData = samples.filter( el => el.id == selectedID);

        let ids = filterData.map(el => el.otu_ids);
        console.log(ids)
        // get only top 10 otu ids
        ids = ids[0].slice(0,10)

        let otu_ids = []

        ids.forEach(function(name){
            otu_ids.push(`OTU ${name}`)
        })
        
        let sample_values = filterData.map(el => el.sample_values).slice(0,10).reverse();
        console.log(sample_values)
        sample_values= sample_values[0]

        // get the top 10 labels for the plot
        let otu_labels =  filterData.map(el => el.otu_labels).slice(0,10);
        console.log(otu_labels)
        otu_labels = otu_labels[0]


        let trace1={
            x: sample_values,
            y:otu_ids,
            text:otu_labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTU",
            yaxis: {
            autorange: "reversed"
            }
        }
        
            let plotData = [trace1];
            // create the bar plot
            Plotly.newPlot("bar", plotData, layout);   
    })
    
}


function bubbleChart(selectedID) {
    d3.json("data/samples.json").then(function(data){
        let samples = data.samples;
        let filterData = samples.filter(el => el.id == selectedID)

        let otu_ids = filterData.map(el => el.otu_ids)
        otu_ids = otu_ids[0]

        let sample_values = filterData.map(el => el.sample_values)
        sample_values = sample_values[0]

        let otu_labels =  filterData.map(el => el.otu_labels)
        otu_labels = otu_labels[0]
        
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values,
              colorscale:"Jet"
            }
        };
          
        let plotData = [trace1];
          
        let layout = {
            showlegend: false,
            xaxis: {
                title: {
                  text: 'OTU ID',
                },
            },
        };
        // create the bubble chart  
        Plotly.newPlot('bubble', plotData, layout);

      
    })
}
init();