import * as React from 'react';

const DEFAULT_VALUE: number = 10;

export default class DemandConfig extends React.Component {

	state: any;

	constructor(props){
		super(props);

		let demands = [];

		for(let i=0; i<23; i++){
			demands.push(DEFAULT_VALUE);
		}

		this.state = {
			demands
		};

		this.onDemandChange = this.onDemandChange.bind(this);
	}

	onDemandChange(arg){
		console.log(arg.target.value)
		console.log(this)
		/*let demands = this.state.demands;
		demands[hour] = ev.target.value;
		this.setState({
			demands
		});*/
	}

	public render() {
		return (
			<table>
				<thead>
					<tr>
						<th>Hour</th>
						<th>Demand %</th>
					</tr>
				</thead>
				<tbody>
					{[...Array(23).keys()].map((n, hour) => (
						<tr key={hour}>
							<td>{n}</td>
							<td><input min={0} max={100} type="number" value={this.state.demands[hour]} onChange={this.onDemandChange.bind(hour)}/></td>
						</tr>
					))}

				</tbody>
			</table>
		);
	}
}
