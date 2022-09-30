import {useMemo} from "react";
import {Table} from "evergreen-ui";

export default function ResultsTable({scores, config}) {

	const sortedData = useMemo(() => {
		let sortableItems = [...scores];
		if (config !== null) {
			sortableItems.sort((a, b) => {

				if (a[config.key].localeCompare(b[config.key]) <= 1) {
					return config.direction === 'asc' ? -1 : 1;
				}
				if (a[config.key].localeCompare(b[config.key]) >= 1) {
					return config.direction === 'asc' ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [scores, config]);

	return (
		<Table.Body>
			{sortedData.length && sortedData?.map((score, idx) => (
				<div key={score?.score_id}>
					<Table.Row key={score?.score_id}>
						<Table.TextCell>{idx + 1}. {score?.user_name}</Table.TextCell>
						<Table.TextCell className="testName">{score?.topic_name}</Table.TextCell>
						<Table.TextCell>{score?.score_percentage >= 65 ?
							<p style={{color: 'green', fontWeight: 'bold'}}>PASS</p> :
							<p style={{color: 'red', fontWeight: 'bold'}}>FAIL</p>}</Table.TextCell>
					</Table.Row>

				</div>

			))}
		</Table.Body>);
}
