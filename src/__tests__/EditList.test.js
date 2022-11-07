import {EditList} from "../components/quiz/EditList";
import {render, screen} from "@testing-library/react";
import {Quiz} from "../api/quiz/Quiz";

test('no elements', () => {

	let quiz = new Quiz('Test Quiz', 'topicidgoeshere', []);

	render(<EditList quiz={quiz} selectedId={-1} setSelectedId={() => {}} errors={{}}/>)

	expect(screen.getByRole('button', {name: /New Question/i})).toBeEnabled()

	screen.debug();
})
