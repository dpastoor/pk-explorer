var React = require('react');
var ReactD3 = require('react-d3');
var _ = require('lodash');

var concTimeArray = function(cl, v, dose, times, idname) {
	var c0 = dose/v;
	var ke = cl/v;
	var res = _.map(times, function(t) {
		return(
			{'x': t,
			'y': c0*Math.exp(-ke*t)}
			);
		});
	return {values: res, name: idname};
}
var baseline = concTimeArray(10, 100, 1000, [0, 0.25, 0.5, 1, 2, 4, 6, 8, 12], "Reference");

var App = React.createClass({
	getInitialState: function() {
		return {
			cl: 10,
			vd: 100,
            data: [baseline,
            	concTimeArray(10, 100, 1000, [0, 0.25, 0.5, 1, 2, 4, 6, 8, 12], "New ID")]
		};
	},
	update: function() {
		this.setState({
			cl: this.refs.cl.refs.inp.getDOMNode().value,
			vd: this.refs.vd.refs.inp.getDOMNode().value,
			data: [baseline,
						concTimeArray(this.refs.cl.refs.inp.getDOMNode().value,
													this.refs.vd.refs.inp.getDOMNode().value,
			 										1000, [0, 0.25, 0.5, 1, 2, 4, 6, 8, 12],"New ID")
						]
		});
	},
	render:function(){
		return(
			<div>
			<Slider ref = "cl" min ="1" max="20" defaultVal="10" update={this.update}/>
			<label>Cl = {this.state.cl}</label>
			<Slider ref = "vd"  min ="1" max="200" defaultVal="100" update={this.update} />
			<label>Vd = {this.state.vd}</label>
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
