import React from 'react'
import { json } from 'd3-fetch' 
import PlacesList from './PlacesList.jsx'

export default class Search extends React.Component {
	constructor(props) {
		super(props)
		this.state = { searchResults:[] }
		this.handleInput = this.handleInput.bind(this);
	}
	handleInput(event) {
		let text = event.target.value.trim()
		if(isNaN(text) && text.length < 2){
			return this.setState({searchResults:[]})
		}
		if(!isNaN(text) & Number(text) > 0){
			json(`./server/jurisdiction.php?geo_id=${Number(text)}`)
				.then(response => {
					// response can be 'undefined'
					this.setState({ searchResults: response ? [response] : [] })
				} )
		}else{
			json(`./server/jurisdiction.php?search=${text}`)
				.then(response => {
					this.setState({searchResults:response})
				} )
		}
	}
	render() {	
		return (
			<div className="search">
				<input type="text"placeholder="Search by place name or ID"   
					onInput={this.handleInput}/>
				<PlacesList id="search-results"
					places={this.state.searchResults}
					onSelection={this.props.onSelection}/>
			</div>
		)
	}
}
