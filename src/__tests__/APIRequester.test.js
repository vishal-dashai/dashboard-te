import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {ContentRequest} from "../api/ContentRequest";
import FIREBASE_CONFIG from "../firebaseconfig";
import firebase from 'firebase/compat/app';

let profile = null;

describe('API Call Test Suite', () => {
	beforeAll(async () => {
		firebase.initializeApp(FIREBASE_CONFIG);
		const creds = await signInWithEmailAndPassword(getAuth(), 'demo@sinatra.ai', 'Sinatra1!');
		profile = await ContentRequest.getUserProfile(creds.user.uid)
	})

	test('User profile has expected name', async () => {
		expect(profile.name).toEqual('sinatra demo')
	})

	test('Got all scores', async () => {
		let scores = await ContentRequest.getAllScores(profile.restaurantId)
		expect(scores.length).not.toEqual(0)
		expect(scores[0].user_name).toEqual('sinatra demo')
	})

	test('Invalid scores request', async () => {
		let scores = await ContentRequest.getAllScores(null)
		expect(scores).toBeNull()
	})

	test('Got daily note', async () => {
		let note = await ContentRequest.getAndStripNote(profile.restaurantId)
		expect(note.includes('<ul>')).toBeFalsy()
		expect(note.includes('<li>')).toBeFalsy()
	})

	test('Invalid daily note', async () => {
		let note = await ContentRequest.getAndStripNote(null)
		expect(note).toBeNull()
	})

	afterAll(async () => {
		await getAuth().signOut()
	})
})


describe('Invalid Login Test', () => {
	test('Bad email', async () => {

		firebase.initializeApp(FIREBASE_CONFIG);

		let error = ''

		try {
			await signInWithEmailAndPassword(getAuth(), 'asdf', 'asdf');
		} catch (e) {
			error = e;
		}

		expect(error.code).toEqual('auth/invalid-email')
	})

	test('Bad password', async () => {
		firebase.initializeApp(FIREBASE_CONFIG);

		let error = ''

		try {
			await signInWithEmailAndPassword(getAuth(), 'demo@sinatra.ai', 'asdf');
		} catch (e) {
			error = e;
		}

		expect(error.code).toEqual('auth/wrong-password')
	})

	test('User profile invalid', async () => {
		const profile = await ContentRequest.getUserProfile(null)
		expect(profile).toBeNull()
	})
})
