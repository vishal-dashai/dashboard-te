import firebase from "firebase/compat";
import FIREBASE_CONFIG from "../firebaseconfig";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {ContentRequest} from "../api/ContentRequest";
import {render, screen} from "@testing-library/react";
import {ScoresTable} from "../pages/merchant/Scores";
import React from "react";
import ResultsTable from "../components/ResultsTable";

let profile = null;

describe('Scores Page Test Suite', () => {
	beforeAll(async () => {
		firebase.initializeApp(FIREBASE_CONFIG);
		const creds = await signInWithEmailAndPassword(getAuth(), 'demo@sinatra.ai', 'Sinatra1!');
		profile = await ContentRequest.getUserProfile(creds.user.uid)
	})

	test('No score content', async () => {
		let scores = await ContentRequest.getAllScores(null)

		await render(<ScoresTable scores={scores} sortConfig={{key: "user_id", direction: "asc"}}
								  requestSorting={() => {
								  }}
								  isLoading={false} searchKey={''}/>)

		expect(screen.getByText('There are currently no scores available.')).toBeInTheDocument()
	})

	test('Search test normally', async () => {
		let scores = await ContentRequest.getAllScores(profile.restaurantId)

		await render(<ResultsTable scores={scores} config={{key: "user_id", direction: "asc"}} searchKey={'food'}/>)

		expect(screen.getAllByText('food')[0]).toBeInTheDocument()
		expect(screen.queryAllByText('beverage')).toEqual([])
	})

	test('Search test mixed', async () => {
		let scores = await ContentRequest.getAllScores(profile.restaurantId)

		await render(<ResultsTable scores={scores} config={{key: "user_id", direction: "asc"}} searchKey={'fOOd'}/>)

		expect(screen.getAllByText('food')[0]).toBeInTheDocument()
		expect(screen.queryAllByText('beverage')).toEqual([])
	})


	test('Search test caps', async () => {
		let scores = await ContentRequest.getAllScores(profile.restaurantId)

		await render(<ResultsTable scores={scores} config={{key: "user_id", direction: "asc"}} searchKey={'BEVERAGE'}/>)

		expect(screen.getAllByText('beverage')[0]).toBeInTheDocument()
		expect(screen.queryAllByText('food')).toEqual([])
	})

	test('Search test nothing', async () => {
		let scores = await ContentRequest.getAllScores(profile.restaurantId)

		await render(<ResultsTable scores={scores} config={{key: "user_id", direction: "asc"}} searchKey={'asdfgf'}/>)

		expect(screen.queryAllByText('beverage')).toEqual([])
		expect(screen.queryAllByText('food')).toEqual([])
	})

	afterAll(async () => {
		await getAuth().signOut()
	})
})
