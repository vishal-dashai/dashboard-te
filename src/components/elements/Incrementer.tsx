import React, {Dispatch, SetStateAction} from "react";
import {Icon, MinusIcon, PlusIcon} from "evergreen-ui";

type IncrementerProps = {
	value: number;
	setValue: Dispatch<SetStateAction<number>>;
};

export default function Incrementer({value, setValue}: IncrementerProps) {
	return (<div className={'incrementerBox'}>
		<button onClick={() => {
			setValue(a => {
				if (a === 0) return 0;
				return a - 1;
			})
		}}>
			<Icon icon={MinusIcon}/>
		</button>

		<p>
			{value}
		</p>

		<button onClick={() => {
			setValue(a => {
				if (a >= 99) return 99;
				return a + 1;
			})
		}}>
			<Icon icon={PlusIcon}/>
		</button>
	</div>);
}
