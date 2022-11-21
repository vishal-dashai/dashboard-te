import {Modal} from "react-bootstrap";
import {CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";
import React, {useState} from "react";

export type IPopup = {

	title: string;
	subText: string;

	cancelText?: string;
	confirmText?: string;
	confirmType?: string;
	loadingText?: string;
	isInProgress?: boolean;

	onConfirmed?: Function;
}

type ConfirmationProps = {
	popupData: IPopup;
};

export function Popup({popupData}: ConfirmationProps) {
	const [show, setModalShow] = useState(true);

	return (
		<Modal
			show={show}
			onHide={() => {
				setModalShow(false)
			}}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			contentClassName={'confirmationModal'}
			backdrop="static"
			keyboard={false}
		>
			{!popupData.isInProgress ? <> <Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					{popupData.title}
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
					<p>{popupData.subText}</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="nextButton"
						id={'prev'}
						onClick={() => {
							setModalShow(false)
						}}
					>
						{popupData.cancelText}
						{<Icon icon={CrossIcon} height={20} width={20} marginTop={3}/>}
					</button>

					<button
						className="nextButton"
						id={popupData?.confirmType}
						onClick={() => {
							popupData.onConfirmed()
							console.log('confiremd')
						}}
					>
						{popupData.confirmText}
						{<Icon icon={TickIcon} height={20} width={20} marginTop={3}/>}
					</button>
				</Modal.Footer></> : <div className={'centerContent'}><h2>{popupData.loadingText}</h2>
				<Spinner/></div>}
		</Modal>
	);
}
