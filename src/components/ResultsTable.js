import React, {useMemo} from "react";
import {Table} from "evergreen-ui";
import Fail from '../assets/svg/close-circle.svg';
import Pass from '../assets/svg/star.svg';

export default function ResultsTable({scores, config, searchKey}) {

	const sortedData = useMemo(() => {
		let sortableItems = [...scores];
		if (config !== null) {
			sortableItems.sort((a, b) => {
				if (config.key === 'score_percentage') {
					if (a[config.key] > b[config.key]) {
						return config.direction === 'asc' ? -1 : 1;
					} else if (a[config.key] < b[config.key]) {
						return config.direction === 'asc' ? 1 : -1;
					}
					return 0;
				}

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
			{sortedData.length && sortedData?.filter(a => {
				if (searchKey != null && searchKey !== '') {
					return a?.user_name?.toLowerCase().includes(searchKey.toLowerCase()) || a?.topic_name?.toLowerCase().includes(searchKey.toLowerCase());
				}
				return true;
			}).map((score, idx) => (
				<div key={score?.score_id}>
					<Table.Row key={score?.score_id} style={{borderBottom: '#E7EAEF solid 2px', width: '100%'}}
							   className={'tableRow'}>
						<Table.TextCell>{idx + 1}. {score?.user_name}</Table.TextCell>
						<Table.TextCell className="testName">{score?.topic_name}</Table.TextCell>
						<Table.TextCell>
							<div className={'bobble'}
								 style={{backgroundColor: (score?.score_percentage >= 65 ? '#c3f3e9' : '#fccfd3')}}>
								<img src={score?.score_percentage >= 65 ? Pass : Fail} alt=""/>
								<p style={{
									color: (score?.score_percentage >= 65 ? '#3b7065' : '#6c3b42')
								}}>{score?.score_percentage >= 65 ? 'Pass' : 'Fail'}</p>
							</div>
						</Table.TextCell>
					</Table.Row>
				</div>
			))}
		</Table.Body>);
}
