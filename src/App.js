import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.scss';
import ToggleButton from './components/ToggleButton';

const width = 800, height = 500, scale = 1.5;

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
          fileName: '',
          vizType: 'Bars'
        }
    }

    componentDidMount(){
      var blob = window.URL || window.webkitURL;
        if (!blob) {
            console.log('Your browser does not support Blob URLs :(');
            return;           
        } else {
            document.getElementById('file').addEventListener('change', (event) => {
                var file = document.getElementById('file').files[0],
                fileURL = blob.createObjectURL(file);
                
                document.getElementById('audio').src = fileURL;
                document.getElementById('audio').volume = 0.2; //initial volume
                this.setState({
                    fileName: file.name.split(/\.(?=[^\.]+$)/)[0] //remove extension from filename string
                })
            });
            this.createVisualization();
        }        
    }

    createVisualization = () => {
        let context = new AudioContext();
        let analyser = context.createAnalyser();
        var svg = d3.select("#audio-viz").select("svg");
        let audio = document.getElementById('audio');
        audio.crossOrigin = "anonymous";
        let audioSrc = context.createMediaElementSource(audio);
        audioSrc.connect(analyser);
        audioSrc.connect(context.destination);
        analyser.connect(context.destination);
        let frequencyData = new Uint8Array(analyser.frequencyBinCount);
        const {vizType} = this.state;

        vizType === 'Bars' ? (
            svg.selectAll('rect')
            .data(frequencyData)
            .enter().append('rect')
        ) : (
            svg.selectAll('circle')
            .data(frequencyData)
            .enter().append('circle')
        )
  
        d3.timer(() => {
            analyser.getByteFrequencyData(frequencyData);
            var colorScale = d3.scaleLinear()
                .domain([0, 150, 300])
                .range(["#1efe01", "#334afe","#fe011e"]);
            
            var circleX = d3.scaleLinear()
                .domain([0, frequencyData.length])
                .range([0, width]);

        let gradient = svg.append("svg:defs")
        	.append("svg:linearGradient")
        	.attr("id", "gradient")
        	.attr("gradientUnits", "userSpaceOnUse")
        	.attr("x1", 0).attr("y1", 500)
        	.attr("x2", 0).attr("y2", 100)     
        	.attr("spreadMethod", "pad");

        gradient.append("svg:stop")
        	.attr("offset", "5%")
        	.attr("stop-color", "black")
        	.attr("stop-opacity", 1);

        gradient.append("svg:stop")
        	.attr("offset", "20%")
        	.attr("stop-color", "#1efe01")
        	.attr("stop-opacity", 1);
          
        gradient.append("svg:stop")
        	.attr("offset", "45%")
        	.attr("stop-color", "#334afe")
        	.attr("stop-opacity", 1);   

        gradient.append("svg:stop")
        	.attr("offset", "70%")
        	.attr("stop-color", "#fe011e")
        	.attr("stop-opacity", 1);


            vizType === 'Bars' ? (
            svg.selectAll('rect')
                .data(frequencyData)
                // .attr('r', function(d) { return width/frequencyData.length/2 + .3; })
                // .attr('cx', function(d, i) { return circleX(i); })
                // .attr('cy', function(d) { 
                //     return height/2 - d; 
                // })
                .attr('x', (d,i) => circleX(i) * 8)
                .attr('y', d => height/1.1 - d * scale)
                .attr('width', d => width/frequencyData.length * 10)
                .attr('height', (d,i) => d ?  i % 2 == 0 ? d * scale : 1 : 1 )
                // .attr('fill', function(d, i) { return colorScale(d * scale); })
                .style("fill", "url(#gradient)")
            ) : (
            svg.selectAll('circle')
                .data(frequencyData)
                .attr('r', (d,i) => d)
                .attr('cx', width/2)
                .attr('cy', height/2 + 10)
                .attr('stroke', function(d, i) { return colorScale(d * scale); })
            )
        });
    }

    handleClick = () => {
      document.getElementById('file').click();
    }

    handleToggle = (toggle) => {
        this.setState({
            vizType: toggle
        })
    }

    render() {
      const { fileName, vizType } = this.state;
      const song = fileName ? fileName : 'Select a song';
      const toggles = ['Bars', 'Circle'];
        return (
                <div className="App">
                    <h2 className="song-title" onClick={this.handleClick}>{song}</h2>
                    <input type="file" id="file" style={{display:"none"}}></input>
                    {/* <h4 style={{color: '#fff'}}>Visualization</h4>
                    <div className="toggle-container">
                        {toggles.map(toggle => {
                            const isActive = vizType === toggle
                            return (
                                <ToggleButton
                                name={toggle}
                                isActive={isActive}
                                handleToggle={this.handleToggle}
                                />
                            )
                        })}
                    </div> */}
                    <div id="audio-viz">
                        <svg
                        width={width}
                        height={height}
                        viewBox={'0 0 ' + width + ' ' + height}
                        preserveAspectRatio="xMidYMid meet"
                        style={{mixBlendMode:"multiply"}}
                        >
                        </svg>
                    </div>
                    <div id="mp3_player">
                    {/* <input type="button" value="Select song..." onClick={this.handleClick} /> */}
                        <div id="audio_box" className="audio-box">
                            <audio
                                id="audio"
                                controls
                                >
                            </audio>
                        </div>
                    </div>
                </div>
                );
            }
        }

        export default App;