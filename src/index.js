var React = require('react');
var ReactD3 = require('react-d3');
var _ = require('lodash');
var pksim = require('pksim');


var App = React.createClass({
	concTimeArray: function(cl, v, amt, numDoses, ii, idname) {

	  var seq = [];
		var doses = [];
		var doseTimes = [];

		for (var i = 0; i < (numDoses*ii+24); i++) {
			seq.push(i);
		}


		for (var i = 0; i < numDoses; i++) {
			doses.push(amt);
			doseTimes.push(i*ii);
		}

	//console.log({seq, doses, doseTimes});

		var reg = {doses: doses, times: doseTimes};
		var regimen = pksim.sampleIntervals(reg, seq);

		var sim = [];
		var lastAmt = 0;
		var simInterval;
		for(var i = 0; i < regimen.length; i++) {
			console.log(regimen[i]);
		console.log("(regimen[i].dose + lastAmt): " + (regimen[i].dose + lastAmt));
			simInterval = pksim.onecmptiv(cl, v, (regimen[i].dose + lastAmt), regimen[i].time);
			lastAmt = simInterval[simInterval.length-1].y*v;
			for(var j in simInterval) {
				sim.push(simInterval[j]);
			}
		}
		return {values: sim, name: idname};
	},
	getInitialState: function() {
		return {
			numDoses: 10,
			amt: 1000,
			ii: 24,
			cl: 10,
			vd: 100,
      data: [this.concTimeArray(10, 100, 1000, 10, 24, "Reference"),
			this.concTimeArray(10, 100, 1000, 10, 24, "New ID")]
		};
	},
	update: function() {
		this.setState({
			numDoses: this.refs.numDoses.refs.inp.getDOMNode().value,
			amt: this.refs.amt.refs.inp.getDOMNode().value,
			ii: this.refs.ii.refs.inp.getDOMNode().value,
			cl: this.refs.cl.refs.inp.getDOMNode().value,
			vd: this.refs.vd.refs.inp.getDOMNode().value,
			data: [this.concTimeArray(10, 100, 1000, 10, 24, "Reference"),
						this.concTimeArray(Number(this.refs.cl.refs.inp.getDOMNode().value),
													Number(this.refs.vd.refs.inp.getDOMNode().value),
			 										Number(this.refs.amt.refs.inp.getDOMNode().value),
			 										Number(this.refs.numDoses.refs.inp.getDOMNode().value),
			 										Number(this.refs.ii.refs.inp.getDOMNode().value),
													"New ID")
						]
		});
	},
	render:function(){
		return(
			<div>
			<Slider ref = "cl" min ="1" max="20" defaultVal="10" step = "1" update={this.update} />
			<label>Cl = {this.state.cl} </label>
			<Slider ref = "vd"  min ="1" max="200" defaultVal="100" step = "1" update={this.update} />
			<label>Vd = {this.state.vd} </label>
			<Slider ref = "numDoses"  min ="1" max="10" defaultVal="10" step = "1" update={this.update} />
			<label>Number Doses = {this.state.numDoses} </label>
			<Slider ref = "amt"  min ="500" max="1500" defaultVal="1000" step = "250" update={this.update} />
			<label>Dose Amount = {this.state.amt} </label>
			<Slider ref = "ii"  min ="6" max="24" defaultVal="24" step = "6" update={this.update} />
			<label> II = {this.state.ii}</label>
			<SomeComponent data={this.state.data} />
			</div>
			)
		}
});

var Slider = React.createClass({
	render:function() {
		return(
			<input
				ref ="inp"
				type="range"
				min={this.props.min}
				max= {this.props.max}
				defaultValue={this.props.defaultVal}
				step = {this.props.step}
				onChange={this.props.update}
			/>
		);
	}
});

  var LineChart = ReactD3.LineChart;
    var Brush = ReactD3.Brush;

var SomeComponent = React.createClass({
    render: function() {
        return (
      		<div>
        		<hr />
						<LineChart
			  				legend={true}
                data={this.props.data}
                width={800}
                height={400}
            />
          </div>
        );
    }

});

React.render(<App />, document.getElementById('root'));
