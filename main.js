import { select, selectAll } from 'd3-selection'
import { json } from 'd3-fetch'

const server = './server'

window.onload = ()=>{
	// set up search bar
	select('.search input')
		.on('input focus',search)
		.on('unfocus',clearSearchResults)
	// populate place types
	json(`${server}/jurisdiction.php?types`).then( types => {
		select('#place-meta form select#type')
			.selectAll('option')
			.data(types)
			.join('option')
			.text(d=>d.label)
	} )
}

function search(event){
	// handles input/changes to the search parameters
	var query = null
	let searchTerm = event.target.value
	// is this a search by name or geo_id?
	if(!isNaN(searchTerm) & Number(searchTerm) > 0){
		query = `geo_id=${Number(searchTerm)}`
	}else if(searchTerm.trim().length >= 2){
		query = `search=${searchTerm}`
	}else{ 
		return clearSearchResults();
	}
	json(`${server}/jurisdiction.php?${query}`).then( response => {
		// wrap a single-object response in an array for consistency
		if( !(response instanceof Array) ){ response = [response] }
		// append results list right after search bar
		let resultsList = select(event.target.parentNode)
			.selectAll('ol.results')
			.data([response]).join('ol').classed('results',true)
		resultsList.selectAll('li')
			.data(d=>d,d=>d.geo_id)
			.join('li').classed('own-search',true)
			.text(d=>`${d.name} (${d.type_of} ${d.parent?'in '+d.parent.name:''})`)
			.on('click',event => {
				select('.search input').property('value','')
				clearSearchResults()
				showPlace( select(event.target).datum().geo_id)
			} )
	} )
}

function clearSearchResults(){
	select('.search .results').remove()
}

function showPlace(geo_id){
	if( isNaN(geo_id) ){ 
		return console.warn('not a valid geo_id')
	}
	json(`${server}/jurisdiction.php?geo_id=${geo_id}`).then( jurisdiction => {
		// set values from response
		let form = select('#place-meta form')
		form.select('input#geo_id').property('value',jurisdiction.geo_id)
		form.select('input#name').property('value',jurisdiction.name)
		form.select('select#type')
			.selectAll('option')
			.attr('selected',d => jurisdiction.type_of == d.label ? true : null)
		// get parents and display
		let [ parents, this_jur ] = [ [], jurisdiction ]
		while(this_jur.parent){
			parents.push(this_jur.parent)
			this_jur = this_jur.parent
		}
		select('ol#parents')
			.selectAll('li')
			.data(parents.reverse())
			.join('li')
			.text(j=>`${j.name} (${j.type_of})`)
	} )
	// get children
	json(`${server}/jurisdiction.php?parent=${geo_id}`).then( children => {
		select('ul#children')
			.selectAll('li')
			.data(children)
			.join('li')
			.text(j=> `${j.name} (${j.type_of})`)
	} )
}

