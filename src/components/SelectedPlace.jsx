import React from 'react'
import RelatedPlacesList from './RelatedPlacesList.jsx'
import AddChildForm from './AddChildForm.jsx'

export default function SelectedPlace(props) {
	return (
		<div id="selected-place">
			<h1>{props.place.name}</h1>
			<p>
				<b>Type:</b> {props.place.type_of}<br/>
				<b>geo_id:</b> {props.place.geo_id}<br/>
				<b>OSM_id:</b> {props.place.osm_id}<br/>
				<a href={`https://www.openstreetmap.org/relation/${props.place.osm_id}`}
					target="_blank">
					OSM relation
				</a><br/>
				{props.place.wiki && 
					<a href={`https://en.wikipedia.org/wiki/${props.place.wiki}`}
						target="_blank">
						Wikipedia
					</a>
				}
			</p>
			<AddChildForm 
				parent={props.place}
				onAddition={props.onNewPlaceSelection}/>
			<div id="relations">
				<RelatedPlacesList title="Parents"  child={props.place}
					onSelection={props.onNewPlaceSelection}/>
				<RelatedPlacesList title="Siblings" sibling={props.place}
					onSelection={props.onNewPlaceSelection}/>
				<RelatedPlacesList title="Children" parent={props.place} 
					onSelection={props.onNewPlaceSelection}/>
			</div>
		</div>
	)
}
