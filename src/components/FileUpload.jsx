import {Alert, FileCard, FileRejectionReason, FileUploader, majorScale, MimeType, rebaseFiles} from "evergreen-ui";
import React from "react";

export const FileUpload = ({files, setFiles}) => {

	const acceptedMimeTypes = [MimeType.jpeg, MimeType.png, MimeType.pdf, MimeType.zip, MimeType.doc, MimeType.docx, MimeType.csv, MimeType.ppt, MimeType.pptx, MimeType.mp4]
	const maxFiles = 20
	const maxSizeInBytes = 1000 * 1024 ** 2 // 50 MB
	const [fileRejections, setFileRejections] = React.useState([])
	const values = React.useMemo(() => {
		return [...files, ...fileRejections.map((fileRejection) => fileRejection.file)]
	}, [
		files,
		fileRejections,
	])
	const handleRemove = React.useCallback(
		(file) => {
			const updatedFiles = files.filter((existingFile) => existingFile !== file)
			const updatedFileRejections = fileRejections.filter((fileRejection) => fileRejection.file !== file)

			// Call rebaseFiles to ensure accepted + rejected files are in sync (some might have previously been
			// rejected for being over the file count limit, but might be under the limit now!)
			const {accepted, rejected} = rebaseFiles(
				[...updatedFiles, ...updatedFileRejections.map((fileRejection) => fileRejection.file)],
				{acceptedMimeTypes, maxFiles, maxSizeInBytes}
			)

			setFiles(accepted)
			setFileRejections(rejected)
		},
		[acceptedMimeTypes, files, fileRejections, maxFiles, maxSizeInBytes]
	)

	const fileCountOverLimit = files.length + fileRejections.length - maxFiles
	const fileCountError = `You can upload up to ${maxFiles} files. Please remove ${fileCountOverLimit} ${fileCountOverLimit === 1 ? 'file' : 'files'}.`

	return (
		<label title={'upload files'}>
			<FileUploader
				acceptedMimeTypes={acceptedMimeTypes}
				label="Upload Your Content"
				description="Upload .pdf, .csv, .excel, .ppt, .doc, .docx, .jpeg, .png, .mp4 files. 1GB size limit per file"
				disabled={files.length + fileRejections.length >= maxFiles}
				maxSizeInBytes={maxSizeInBytes}
				maxFiles={maxFiles}
				onAccepted={(file) => {
					setFiles(a => [...a, ...file])
				}}
				onRejected={setFileRejections}
				renderFile={(file, index) => {
					const {name, size, type} = file
					const renderFileCountError = index === 0 && fileCountOverLimit > 0

					const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file && fileRejection.reason !== FileRejectionReason.OverFileLimit)
					const {message} = fileRejection || {}

					return (
						<React.Fragment key={`${file.name}-${index}`}>
							{renderFileCountError &&
								<Alert intent="danger" marginBottom={majorScale(2)}
									   title={fileCountError}/>}
							<FileCard
								isInvalid={fileRejection != null}
								name={name}
								onRemove={() => handleRemove(file)}
								sizeInBytes={size}
								type={type}
								validationMessage={message}
							/>
						</React.Fragment>
					)
				}}
				values={values}
			/></label>)
}
