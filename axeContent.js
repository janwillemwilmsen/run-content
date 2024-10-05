///// import { sendMessageToClient } from './../index.js';


////// textDetails removed.

const axeContent = async (page, clientId) => {
    const baseUrl = "your-base-url"; // define this if it's required

    const getAbsoluteUrl = (url) => {
        const regex = new RegExp('^(?:[a-z]+:)?//', 'i');
        return regex.test(url) ? url : `https://${baseUrl}${url}`;
    };


	const pageUrl = await page.url();

	let  pagetitles =''
	try {
		pagetitles = await page.title();
		console.log(`Page title is: ${pagetitles}`);
	} catch (error) {
		console.error('Error retrieving page title:', error);
	}


	// console.log('pageUrl in axeContent.js', pageUrl)
	let pageDetails = [];
	try {
		pageDetails.push({
			type: 'pageInfo',
			url: pageUrl,
			pageTitles: pagetitles,
		});
	}
	catch (error) {
		pageDetails.push({
			type: 'pageInfo',
			url: 'Url gave errors, or was redirected',
			pageTitles: 'uhohhh'
		});
	}
	// console.log('pageDetails', pageDetails)







///////////////////////////// For images
	/// https://www.w3.org/WAI/tutorials/images/ 2017


	// FROM HERE
	let iid = 0
	let svgId = 0
	let imgId = 0
    // Selecting all <a> and <button> elements and logging their outer HTML


	const imageDetails = [];
	try {
    const images = await page.$$('img, svg');

	
	
	for (let img of images) {
		iid++ 
		let remainingImages = images.length - iid;
		///// sendMessageToClient(clientId, `Testing image ${iid}/${images.length}. ${remainingImages} image(s) left to test.`);

 
		const tagName = await img.evaluate(e => e.tagName);
		console.log('tagName',tagName)
		const { hasAriaHiddenTrue } = await checkAriaHiddenIsTrue(img);
		let isSvg = false
		let titleDesc = '';
		if(tagName === 'svg'){
			 titleDesc = await getTitleOrDescFromSvg(img);
			 isSvg = true
			 svgId++
		}
		else {
			imgId++
		}
		// console.log('titleDesc :: :: ::', titleDesc)
		// console.log('Aria Hidden ', hasAriaHiddenTrue, isSvg, titleDesc , hasRoleImage)

		let src = await img.getAttribute('src');
		src = processImageSrc(src);
		// console.log('src', src)
		/// Alt
		const altTextValue = await checkAltAttribute(img);
		const alt = await img.getAttribute('alt'); 
		let hasAltAttribute = alt !== null;  // Checks if alt attribute exists
		/// Title
		const titleTextValue = await checkTitleAttribute(img);
		let title = await img.getAttribute('title'); 
		let hasTitleTag = title !== null; 
		/// Role
		const role = await img.getAttribute('role');
		let hasRolePresentation = role === 'presentation';
		let hasRoleNone = role === 'none';
		let hasRoleImage = role === 'image';

		/// Aria-* /// when is this ever used. using labels to describe images?
		const ariaLabel = await img.getAttribute('aria-label');
		const ariaLabelledBy = await img.getAttribute('aria-labelledby');
		const ariaDescribedBy = await img.getAttribute('aria-describedby');
		
		let hasAriaLabel = ariaLabel !== null;
		let hasAriaLabelledBy = ariaLabelledBy !== null;
		let hasAriaDescribedBy = ariaDescribedBy !== null;
		
		// console.log('hasAriaLabel',hasAriaLabel)
		// console.log('hasAriaLabelledBy',hasAriaLabelledBy)
		// console.log('hasAriaDescribedBy',hasAriaDescribedBy)
		
		// console.log('ariaLabelledBy',ariaLabelledBy)
		// console.log('ariaDescribedBy',ariaDescribedBy)
		
			
		let ariaLabelText = ariaLabel || "";
		let ariaDescribedByText = await getContentForAriaAttributes(ariaDescribedBy, page);
		let ariaLabelledByText = await getContentForAriaAttributes(ariaLabelledBy, page);
		
		// console.log('ariaLabelText',ariaLabelText)
		// console.log('ariaDescribedByText',ariaDescribedByText)
		// console.log('ariaLabelledByText',ariaLabelledByText)
										 
		// Usage in image loop
		const linkData = await findAncestorLink(img);
		const ariaData = await findAncestorWithAriaAttributes(img);
		// console.log('img', img)

		
		const { inFigureElement, hasFigcaption, figcaptionText } = await isInFigureWithFigcaption(img);
		// console.log("In Figure Element:", inFigureElement); // true or false
		// console.log("Has Figcaption:", hasFigcaption); // true or false
		// console.log("Figcaption Text:", figcaptionText); // Text content of the <figcaption> or an empty string if none


		
		let isImageInLink = linkData && linkData.isLink;
		let linkTextContent = linkData ? linkData.linkTextContent : "";
		
		 
		const result = await processOuterAriaData(ariaData, page);
		// console.log(result.ariaContent); // Access ariaContent
		// console.log(result.isImageInAriaAttribute);

		const ariaContent = result.ariaContent
		const isImageInAriaAttribute = result.isImageInAriaAttribute

		let advice = ''
		 /// turned off need to work out the rules

		// // console.log('Img in link no text, alt describing link?', isImageInLink , linkTextContent)
		// if (isImageInLink && linkTextContent === '' && hasAltAttribute) {
		// 	advice += 'Image is inside a link with no text content. Ensure the image’s alt text describes the target or purpose of the link.';
		// }

		// 	// Check if image is hidden by role or aria, and if it incorrectly has alt text
		// if ((hasRolePresentation || hasRoleNone || hasAriaHiddenTrue) && hasAltAttribute) {
		// 	advice += 'Image is hidden by role or aria, but it has alt text. Consider removing the alt text if the image is purely decorative. ';
		// }
		// console.log('Has Role Presentation', hasRolePresentation,'Has Role None', hasRoleNone, 'Has Aria Hidden', hasAriaHiddenTrue, 'Has Alt attribute', hasAltAttribute )
		// // Check if image is not hidden but lacks alt text
		// if (!hasRolePresentation && !hasRoleNone && !hasAriaHiddenTrue && !hasAltAttribute) {
		// 	advice += 'Image is not hidden by role or aria and lacks alt text. Consider adding descriptive alt text if the image is informative. ';
		// }

		// 	// Check if image has conflicting roles
		// if ((hasRolePresentation || hasRoleNone) && hasRoleImage) {
		// 	advice += 'Image has multiple roles which is not allowed. ';
		// }

		// // Check for redundancy between alt text and ARIA attributes
		// if (hasAltAttribute && (hasAriaLabel || hasAriaLabelledBy || hasAriaDescribedBy)) {
		// 	advice += 'Image has both Alt text and ARIA attributes. Ensure the ARIA data is not redundant and adds value to the alt text. ';
		// }

		// // Check for the presence of title attribute
		// if (title) {
		// 	advice += 'Image has a title attribute. Be cautious, as the title attribute is not recommended for accessibility if used as a substitute for descriptive alt text. ';
		// }

		// console.log('------------------> advice:',advice)
			
			imageDetails.push({
				type: tagName.toLowerCase(),
				// imgId: imageDetails.length,
				imgId: iid,
				svgId: isSvg ? svgId : undefined, // Push svgId if isSvg is true
    			imageId: !isSvg ? imgId : undefined,
				isSvg: isSvg,
				hasAriaHiddenTrue: hasAriaHiddenTrue, 
				titleDesc: titleDesc, 
				alt: alt,
				src: src,
				altTextValue : altTextValue,
				inFigureElement: inFigureElement, 
				hasFigcaption: hasFigcaption, 
				figcaptionText: figcaptionText,
				ariaLabel : ariaLabel,
				hasAriaLabel : hasAriaLabel,
				ariaLabelText : ariaLabelText,
				ariaLabelledBy : ariaLabelledBy,
				hasAriaLabelledBy : hasAriaLabelledBy,
				ariaLabelledByText : ariaLabelledByText,
				hasAltAttribute : hasAltAttribute,
				ariaDescribedBy: ariaDescribedBy,
				hasAriaDescribedBy: hasAriaDescribedBy,
				ariaDescribedByText: ariaDescribedByText,
				role: role,
				hasRolePresentation: hasRolePresentation,
				hasRoleNone: hasRoleNone,
				hasRoleImage: hasRoleImage,
				title: title,
				hasTitleTag: hasTitleTag, 
				titleTextValue: titleTextValue,
				isImageInLink: isImageInLink,
				linkTextContent: linkTextContent,
				isImageInAriaAttribute: isImageInAriaAttribute,
				ariaContent: ariaContent,
				advice: advice

				// src: getAbsoluteUrl(src)
			});
		} /// end Loop..

		console.log('finished pushing data')

	} 
	catch (error) {
		imageDetails.push({
			type: 'img',
			imgId: '1',
			svgId: '0',
			imgageId: '0',
			hasAriaHiddenTrue: '', 
			isSvg: '',
			titleDesc: '' , 
			alt: 'eror happened',
			src: 'no value',
			ariaLabel : '',
			ariaLabelledBy : '',
			hasAltAttribute : '',
			altTextValue : '',
			inFigureElement: '', 
			hasFigcaption: '', 
			figcaptionText: '',
			hasAriaLabel : '',
			ariaLabelText : '',
			hasAriaLabelledBy : '',
			ariaLabelledByText : '',
			ariaDescribedBy: '',
			hasAriaDescribedBy: '',
			ariaDescribedByText: '',
			role: '',
			hasRolePresentation: '',
			hasRoleNone: '',
			hasRoleImage: '',
			title: '',
			hasTitleTag: '', 
			titleTextValue: '',
			isImageInLink: '',
			linkTextContent: '',
			isImageInAriaAttribute: '',
			ariaContent: '',
			advice: ''
		});
		console.error("Error while processing images:", error.message);
		// You can decide to continue, retry, or abort depending on the situation
	}
	

/// TO HERE

/// functions for images
async function checkAltAttribute(img) {
	const alt = await img.getAttribute('alt');
	let altTextValue;

	if (alt === null) {
		altTextValue = "No alt attribute";  // No alt attribute
	} else if (alt === '') {
		altTextValue = "Alt attribute is empty('alt') or present without value('alt=&quot;&quot;')";
	} else {
		altTextValue = alt;  // Alt attribute has text
	}

	return altTextValue;
}

async function checkTitleAttribute(img) {
	const title = await img.getAttribute('title');
	let titleTextValue;

	if (title === null) {
		titleTextValue = "No title attribute";  // Title attribute is not present
	} else if (title === '') {
		titleTextValue = "Title attribute is empty";  // Title attribute is present but empty
	} else {
		titleTextValue = title;  // Title attribute has text
	}

	return titleTextValue;
}

async function processOuterAriaData(ariaData, page) {
	let isImageInAriaAttribute = false;
	let ariaContent = "";

	if (ariaData) {
		// console.log('found outer aria', ariaData);
		let outerAriaContentParts = [];
		let hasOuterAriaData = false;

		if (ariaData.outerAriaLabel) {
			ariaContent += ariaData.outerAriaLabel;
			isImageInAriaAttribute = true;
			// console.log('ariaContent', ariaContent);
		}

		// Process aria-labelledby and aria-describedby
		for (const attr of ['outerAriaLabelledBy', 'outerAriaDescribedBy']) {
			// console.log('attr in loop', attr, ariaData)

			if (ariaData[attr]) {
				// console.log('in for loop')
				isImageInAriaAttribute = true;
				const ids = ariaData[attr].split(' ');
				// console.log(`Processing ${attr}:`, ids);

				for (const id of ids) {
					const element = await page.$(`[id='${id}']`);
					if (element) {
						const text = await element.evaluate(node => node.textContent);
						if (text) {
							// console.log(`Found text for #${id}:`, text);
							outerAriaContentParts.push(text);
						}
					} else {
						console.error(`Element not found for ID: ${id}`);
						outerAriaContentParts.push(`Mismatch in IDs - content not found for ${id}`);
					}
					hasOuterAriaData = true;
				}
			}
		}

		if (hasOuterAriaData) {
			const outerAriaContent = outerAriaContentParts.join(" ");
			ariaContent += " " + outerAriaContent;
		}
	}

	return { ariaContent, isImageInAriaAttribute };
}
async function findAncestorLink(elementHandle, depth = 0) {
	if (depth > 10) return null;

	const tagName = await elementHandle.evaluate(el => el.tagName.toLowerCase()).catch(() => null);
	if (tagName === 'a' || tagName === 'button') {
		const linkTextContent = await elementHandle.evaluate(el => el.textContent.trim());
		return { isLink: true, linkTextContent };
	}

	const parentElement = await elementHandle.evaluateHandle(el => el.parentElement).catch(() => null);
	if (!parentElement || !(await parentElement.asElement())) return { isLink: false};  // changed from null to { isLink: false}

	return findAncestorLink(parentElement, depth + 1);
}
/// Figure 
async function isInFigureWithFigcaption(elementHandle, depth = 0) {
	if (depth > 10) return { inFigureElement: false, hasFigcaption: false, figcaptionText: '' };

	// Check if the current element is a <figure>
	const tagName = await elementHandle.evaluate(el => el.tagName.toLowerCase());
	if (tagName === 'figure') {
		const figcaptionElement = await elementHandle.$('figcaption');
		const hasFigcaption = !!figcaptionElement;
		let figcaptionText = '';
		if (hasFigcaption) {
			figcaptionText = await figcaptionElement.evaluate(node => node.textContent.trim());
		}
		return { inFigureElement: true, hasFigcaption, figcaptionText };
	}

	// Move up to the parent element
	const parentElementHandle = await elementHandle.evaluateHandle(el => el.parentElement);
	if (!parentElementHandle || !(await parentElementHandle.asElement())) {
		return { inFigureElement: false, hasFigcaption: false, figcaptionText: '' };
	}

	// Recursively check the parent element with incremented depth
	return isInFigureWithFigcaption(parentElementHandle, depth + 1);
}

function processImageSrc(src) {
	if (src) {
		// Check if the src starts with 'data:image' and its length exceeds 500 characters
		if (src.startsWith('data:image') && src.length > 500) {
			src = src.substring(0, 70) + "...";  // Truncate and add ellipsis
		}
	} else {
		src = "N/A";  // Or some default value indicating the src was missing or null
	}
	return src;
}
async function extractImageData(element) {
    const imgChildElemHandles = await element.$$('img');
    const svgChildElemHandles = await element.$$('svg');
    const hasImageInLink = imgChildElemHandles.length > 0 || svgChildElemHandles.length > 0;
	const isNormalImage = imgChildElemHandles.length > 0
	const imageIsSvg = svgChildElemHandles.length > 0
    return { hasImageInLink, imgChildElemHandles, svgChildElemHandles, isNormalImage, imageIsSvg };
}

// async function getAltTextfromImage(imgChildElemHandle) {
//     return imgChildElemHandle ? await imgChildElemHandle.getAttribute('alt') : 'ALT HERE';
// }
async function getAltTextfromImage(imgChildElemHandle) {
    if (!imgChildElemHandle) {
        return 'No image element';
    }
    const altAttribute = await imgChildElemHandle.getAttribute('alt');
    if (altAttribute === null) {
        return 'Alt tag not present(No, alt alt="" or alt="image description")';
    } else if (altAttribute === '') {
        return 'Alt tag present but empty (alt or alt="" - decorative image)';
    } else {
        return `${altAttribute}`;
    }
}
async function getTitleTextfromImage(imgChildElemHandle) {
    return imgChildElemHandle = await imgChildElemHandle.getAttribute('title');
}
async function getTitleOrDescFromSvg(svgChildElemHandle) {
    if (!svgChildElemHandle) {
        return '';
    }
    const title = await svgChildElemHandle.$$eval('title', titles => titles.map(t => t.textContent.trim()).join(' '));
    const desc = await svgChildElemHandle.$$eval('desc', descs => descs.map(d => d.textContent.trim()).join(' '));
    const parts = [];
    if (title) parts.push(title);
    if (desc) parts.push(desc);

    return parts.join(' ').trim();
}

async function checkSvgForAriaLabel(svgChildElemHandle) {
	const svfgAriaLabel =  await svgChildElemHandle.getAttribute('aria-label') 
	if (svfgAriaLabel) {
		return svfgAriaLabel
	}
	else {
		return ''
	}
}

/// Multiple IDs in the Aria-LabelledBy attribute:
async function checkSvgForAriaLabelledBy(svgChildElemHandle, page) {
    if (svgChildElemHandle) {
        const ariaLabelledByAttr = await svgChildElemHandle.getAttribute('aria-labelledby');
        if (ariaLabelledByAttr) {
            const ariaLabelledByIds = ariaLabelledByAttr.split(' ');
            let labelledTexts = [];

            for (const id of ariaLabelledByIds) {
                const labelledElement = await page.$(`#${id}`);
                const textContent = labelledElement ? await labelledElement.evaluate(node => node.textContent) : `Mismatch in ID - content not found for ${id}`;
                labelledTexts.push(textContent);
            }

            return labelledTexts.join(' '); // Joining all texts with space, or you can use '\n' to separate them by line.
        }
    }
    return '';
}

async function checkSvgForAriaDescribedBy(svgChildElemHandle, page) {
    if (svgChildElemHandle) {
        const ariaDescribedByAttr = await svgChildElemHandle.getAttribute('aria-describedby');
        if (ariaDescribedByAttr) {
            const ariaDescribedByIds = ariaDescribedByAttr.split(' ');
            let describedTexts = [];

            for (const id of ariaDescribedByIds) {
                const describedElement = await page.$(`#${id}`);
                const textContent = describedElement ? await describedElement.evaluate(node => node.textContent) : `Mismatch in ID - content not found for ${id}`;
                describedTexts.push(textContent);
            }

            return describedTexts.join(' '); // Joining all texts with space, or you can use '\n' to separate them by line.
        }
    }
    return '';
}

/// Get aria-labelledby and aria-describedby value 
async function getContentForAriaAttributes(attributeValue, page) {
if (!attributeValue) return '';

const ids = attributeValue.split(' ').filter(id => id.trim() !== '');
const contents = await Promise.all(ids.map(async id => {
const element = await page.$(`[id='${id}']`);
if (element) {
const text = await element.evaluate(node => node.textContent);
// Replace multiple whitespace characters with a single space
return text.replace(/\s+/g, ' ').trim();
} else {
return `Aria Mismatch for ${id}`;
}
}));

return contents.filter(content => content.trim() !== '').join(' ');
}

// Check 10 levels up for elements with Aria-* - returns value or IDs
async function findAncestorWithAriaAttributes(elementHandle, depth = 0) {
	if (depth > 10) return null;

	// Fetch the parent element of the current element, start checking from the parent
	const parentElement = await elementHandle.evaluateHandle(el => el.parentElement).catch(() => null);
	if (!parentElement || !(await parentElement.asElement())) return null;

	const outerAriaLabel = await parentElement.evaluate(el => el.getAttribute('aria-label')).catch(() => null);
	const outerAriaLabelledBy = await parentElement.evaluate(el => el.getAttribute('aria-labelledby')).catch(() => null);
	const outerAriaDescribedBy = await parentElement.evaluate(el => el.getAttribute('aria-describedby')).catch(() => null);

	if (outerAriaLabel || outerAriaLabelledBy || outerAriaDescribedBy) {
		return { outerAriaLabel, outerAriaLabelledBy, outerAriaDescribedBy };
	}

	// Recursively check the ancestors
	return findAncestorWithAriaAttributes(parentElement, depth + 1);
}

// Looks for the values of the Aria-* returns in outer
async function processAriaAttributes(ariaData, page) {
    let outerAriaContentParts = [];
    let hasOuterAriaData = false;

    if (ariaData) {
        if (ariaData.outerAriaLabel) {
            outerAriaContentParts.push(ariaData.outerAriaLabel);
            hasOuterAriaData = true;
        }

        for (const attr of ['outerAriaLabelledBy', 'outerAriaDescribedBy']) {
            if (ariaData[attr]) {
                const ids = ariaData[attr].split(' ');
                // console.log(`Processing ${attr}:`, ids); // Debugging log

                for (const id of ids) {
                    const element = await page.$(`[id='${id}']`);
                    if (element) {
                        const text = await element.evaluate(node => node.textContent);
                        if (text) {
                            // console.log(`Found text for #${id}:`, text); // Debugging log
                            outerAriaContentParts.push(text);
                        }
                    } else {
                        console.error(`Element not found for ID: ${id}`); // Error log
                        outerAriaContentParts.push(`Mismatch in IDs - content not found for ${id}`);
                    }
                    hasOuterAriaData = true;
                }
            }
        }
    }

    const outerAriaContent = outerAriaContentParts.join(' ').trim();
    return { outerAriaContent, hasOuterAriaData };
}

async function checkImageRoleForPresentationOrNone(elementHandle) {
    const role = await elementHandle.getAttribute('role');
    return {
        hasRolePresentationOrRoleNone: role === 'presentation' || role === 'none'
    };
}


/// NEED TO DO IT RECURSIVLY....
// async function checkAriaHiddenIsTrue(elementHandle) {
//     const ariaHidden = await elementHandle.getAttribute('aria-hidden');
//     return {
//         hasAriaHiddenTrue: ariaHidden === 'true'
//     };
// }

// Check the element and up to 10 ancestor levels for aria-hidden="true"
async function checkAriaHiddenIsTrue(elementHandle, depth = 0) {
    if (depth > 10) return { hasAriaHiddenTrue: false }; // Stop after 10 levels

    // Fetch the current element's aria-hidden attribute
    const ariaHidden = await elementHandle.evaluate(el => el.getAttribute('aria-hidden')).catch(() => null);
    if (ariaHidden === 'true') {
        return { hasAriaHiddenTrue: true }; // Return true immediately if any element has aria-hidden="true"
    }

    // Fetch the parent element of the current element
    const parentElement = await elementHandle.evaluateHandle(el => el.parentElement).catch(() => null);
    if (!parentElement || !(await parentElement.asElement())) {
        return { hasAriaHiddenTrue: false }; // If no parent or parent is not an element, return false
    }

    // Recursively check the parent element
    return checkAriaHiddenIsTrue(parentElement, depth + 1);
}


/// end functions for images




async function HasShadowDOM(elementItem){
	return  await elementItem.evaluate(node => {
		// Recursive function to check for shadow DOM descendants
		function hasShadowDOMDescendants(element) {
			if (element.shadowRoot instanceof ShadowRoot) {
				return true;
			}
			const children = Array.from(element.children);
			for (let child of children) {
				if (hasShadowDOMDescendants(child)) {
					return true;
				}
			}
			return false;
		}
		
		// Start the recursive check from the current node
		return hasShadowDOMDescendants(node);
	});
}

 async function HasShadowDOMContent(elementItem){
	return await elementItem.evaluate((node) => {
		 function recursivelyExtractText(node) {
			 let text = "";
			 if (node.shadowRoot) {
				 // Access the shadow root and get text from its children
				 text += Array.from(node.shadowRoot.childNodes).map(child => recursivelyExtractText(child)).join(" ");
				} else if (node.nodeType === Node.TEXT_NODE) {
					// Directly concatenate text from text nodes
					// text += node.textContent;
					const trimmedText = node.textContent.trim();
					if (trimmedText) {
						text += trimmedText + " "; // Add a space for separation
					}
				} else if (node.childNodes.length > 0) {
					// Recurse through all child nodes
					text += Array.from(node.childNodes).map(child => recursivelyExtractText(child)).join(" ");
				}
				return text;
			}
			return recursivelyExtractText(node);
		});
}


async function containsSlots(elementItem) {
	// First, check if there are any slot elements
	const slotCount = await elementItem.$$eval('slot', slots => slots.length);

	// If slots are present, fetch their content
	if (slotCount > 0) {
		// const slotContent = await fetchSlotContent(elementItem);
		console.log('Slot content:');
		return true;  // Slots are present and content is fetched
	}
	return false;  // No slots are present
}

async function fetchSlotContent(elementItem) {
	return await elementItem.evaluate((node) => {
		let allText = '';

		// Function to recursively gather text from nodes
		function collectText(node) {
			let textContent = '';

			// If node is a slot, get its assigned nodes and process them
			if (node.tagName === 'SLOT') {
				const nodes = node.assignedNodes({ flatten: true });
				textContent = nodes.map(child => collectText(child)).join(" ").trim();
			} else if (node.nodeType === Node.TEXT_NODE) {
				// Directly use text content from text nodes
				textContent = node.textContent.trim();
			} else {
				// Recursively process all children nodes
				textContent = Array.from(node.childNodes).map(child => collectText(child)).join(" ").trim();
			}
			return textContent;
		}

		// Start with the passed node
		allText = collectText(node);
		return allText.trim();  // Ensure to trim the final accumulated text
	});
}













	    ////// Get link-text and alt text on images: new/old...

		/// added this to remove styles that are inserted via svg elements. eneco.nl.
		function removeInlineCSS(text) {
			// This regex will match <style>...</style> tags and their content
			    // Remove <style>...</style> tags and their content
				let cleanedText = text.replace(/<style[^>]*>.*?<\/style>/gs, '');
    
				// Remove <svg>...</svg> tags and their content
				cleanedText = cleanedText.replace(/<svg[^>]*>.*?<\/svg>/gs, '');
				
				// Remove inline CSS rules
				cleanedText = cleanedText.replace(/(\s*{[^}]*}\s*)+/g, '');
				return cleanedText;
		}

		async function countElementId(elementItem, buttonId, ahrefId) {
			// console.log('countElementId called');

			// const elementType = await elementItem.evaluate(e => e.tagName); //// ONLY LINK OR BUTTON element
			 // Evaluate the tag name and the role of the element
			 const { elementType, elementRole } = await elementItem.evaluate(e => ({
				elementType: e.tagName.toLowerCase(), // Get tag name and convert to lower case
				elementRole: e.getAttribute('role') // Get the value of the role attribute
			}));


			// console.log('elementType',elementType)
			const element = elementType.toLowerCase();
			// console.log('element',element)
			// const isButton = element === "button"; /// OLD
			const isButton = elementType === "button" || elementRole === "button";

			// console.log('isButton',isButton)
			
		
			if (isButton) {
				buttonId++;  // Increment buttonId if it's a button
			} else {
				ahrefId++;   // Increment ahrefId if it's an anchor
			}
			const buttonOrLinkId = isButton ? buttonId : ahrefId;
		
			// Include other logic to extract data from the element
			// console.log('buttonOrLinkId, buttonId, ahrefId -->', buttonOrLinkId, buttonId, ahrefId)
			return {buttonOrLinkId, buttonId, ahrefId };
		}


		async function extractElementData(elementItem, pageUrl,id) {

			let linkId = id
			
			// const href = await elementItem.getAttribute('href');
			// let linkUrl, isInternal;
			// const elementType = await elementItem.evaluate(e => e.tagName);  ///// OLD
			const { elementType, elementRole } = await elementItem.evaluate(e => ({
				elementType: e.tagName.toLowerCase(), // Get tag name and convert to lower case
				elementRole: e.getAttribute('role') // Get the value of the role attribute
			}));


			const element = elementType.toLowerCase();
			// const isButton = element === "button"; //// OLD before role
			const isButton = elementType === "button" || elementRole === "button";

			 
		
			// if (href && !href.includes('@') && !href.includes(' ')) {
				let linkUrl, isInternal, href
		
				try {
		
					if (element === 'a') {
					
						href = await elementItem.getAttribute('href');
						if (href && !href.includes(' ')) {
							try{
		
								linkUrl = new URL(href, pageUrl).href;
								isInternal = new URL(href, pageUrl).hostname === new URL(pageUrl).hostname;
							}
							catch{
								linkUrl = 'href is missing'
								isInternal = 'N/A'
							}
						} else {
							linkUrl = 'N/A';
							isInternal = 'N/A';
						}
					} else {
						linkUrl = 'on page, button functionality(no URL)';
						isInternal = 'N/A';
					}
				}
				catch {
					linkUrl = 'Failed getting link';
					isInternal = 'N/A';
				}
		
			// linkUrl = href
		
			// const elementType = await elementItem.evaluate(e => e.tagName);
			// const element = elementType.toLowerCase();
			const type = 'linkElement2';
			const relAttribute = await elementItem.getAttribute('rel');
			const target = await elementItem.getAttribute('target');
			const titleAttribute = await elementItem.getAttribute('title');
			const tabindexAttribute = await elementItem.getAttribute('tabindex');
			const isOpeningNewWindow = target === '_blank';
			const linkTxt = await elementItem.textContent();
			const linkTxtR = linkTxt.replace(/\s/g, ' ').trim();
			const hasTabindex = tabindexAttribute !== null;
			const hastitleAttribute = titleAttribute !== null;
			let haslinkTxtR = linkTxtR !== ''; /// later on in code - setting shadowdomcontent and slotcontent to linkTextR - need to update this variable
			const elementAriaLabel = await elementItem.getAttribute('aria-label');
			const elementAriaLabelledBy = await elementItem.getAttribute('aria-labelledby');
			const elementAriaDescribedBy = await elementItem.getAttribute('aria-describedby');
			let hasAriaDataOnElement = false;
			if (elementAriaLabel || elementAriaLabelledBy || elementAriaDescribedBy) {
				hasAriaDataOnElement = true;
			}
			return {
				type,
				element,
				linkId,
				relAttribute,
				linkTxt: linkTxtR,
				linkUrl,
				isInternal,
				target,
				titleAttribute,
				tabindexAttribute,
				isOpeningNewWindow,
				isButton,
				hasTabindex,
				hastitleAttribute,
				haslinkTxtR,
				hasAriaDataOnElement,
				elementAriaLabel,
				elementAriaLabelledBy,
				elementAriaDescribedBy
			};
		}



let id = 0

// Selecting all <a> and <button> elements and logging their outer HTML


let urlHrefsArr = [];
let buttonId = 0;
let ahrefId = 0;
try {


const elements = await page.$$('a, button, [role="link"], [role="button"]');



/// add src for img
/// add selector - check all upper elements. To much processing. Not for now...
// for (let i = 0; i < urlHrefs.length; i++) {
for (const elementItem of elements) {
	id++
	let remainingLinks = elements.length - id;

	///// // sendMessageToClient(clientId, `Testing links and buttons ${id}..`);
	///// sendMessageToClient(clientId, `Testing links/buttons ${id}/${elements.length}. ${remainingLinks} left to test.`);

	// console.log('TEST', pageUrl )
	console.log('TEST', id, buttonId, ahrefId, page.url() )
	const elementIds = await countElementId(elementItem, buttonId, ahrefId, page.url());
	// console.log('eIds', elementIds)
	const {  buttonOrLinkId, buttonId: updatedButtonId, ahrefId: updatedAhrefId } = elementIds;

	buttonId = updatedButtonId;
	ahrefId = updatedAhrefId;

	const linkcontainsSlot = await containsSlots(elementItem)
	const linkslotContent = await fetchSlotContent(elementItem)


	const linkHasShadowDOM = await HasShadowDOM(elementItem)
	const linkHasShadowDOMContent = await HasShadowDOMContent(elementItem)

	const elementData = await extractElementData(elementItem, page.url(), id);
	let { type, element, linkUrl, linkId,  relAttribute, linkTxt: linkTxtR, isInternal, target, titleAttribute, tabindexAttribute,isOpeningNewWindow, isButton, hasTabindex, hastitleAttribute, haslinkTxtR, hasAriaDataOnElement, elementAriaLabel, elementAriaLabelledBy, elementAriaDescribedBy } = elementData;

	// On the element
	const elementAriaLabelledByText = await getContentForAriaAttributes(elementAriaLabelledBy, page);
	const elementAriaDescribedByText = await getContentForAriaAttributes(elementAriaDescribedBy, page);

	// aria outside the element ///// ---> This was from when I thought aria-* on surrounding elements had impact and were important. Guess they are not. So setting to empty string..
	// const outerAriaData = await findAncestorWithAriaAttributes(elementItem);
	// const { outerAriaContent, hasOuterAriaData } = await processAriaAttributes(outerAriaData, page);
	const hasOuterAriaData = false /// might be better with false..............
	const outerAriaContent = false 
	
	// console.log('outerAriaData', outerAriaData)
	// console.log('Aria-*', outerAriaContent, hasOuterAriaData)

	// console.log(elementData);
	// const dataString2 = JSON.stringify({ elementData /* other data */ }) + '\n' ;
	// fs.appendFileSync('z-test-file.txt', dataString2);
	// If Image is in Link
	   const { hasImageInLink, imgChildElemHandles, svgChildElemHandles, isNormalImage, imageIsSvg  } = await extractImageData(elementItem);

	// const { hasImageInLink, imageIsNormalImage, imageIsSvg, imgChildElemHandle, svgChildElemHandle } = await extractImageData(elementItem);
	// const { hasImageInLink, imgChildElemHandles, svgChildElemHandles } = await extractImageData(elementItem);
	
	let imageDetails = [];
	
	if (hasImageInLink) {
		let imageId = 0;
		// Also check picture element? no think img in picture should be enough one image only used.
		// set .svg files without params and role=img to svg
		for (const imgElem of imgChildElemHandles) {
			const altText = await getAltTextfromImage(imgElem);
			const titleText = await getTitleTextfromImage(imgElem);
			const { hasAriaHiddenTrue } = await checkAriaHiddenIsTrue(imgElem);
			const { hasRolePresentationOrRoleNone } = await checkImageRoleForPresentationOrNone(imgElem);
			imageDetails.push({ imageId: imageId++, type: 'img', altText: altText, titleText: titleText, hasAriaHiddenTrue: hasAriaHiddenTrue, hasRolePresentationOrRoleNone: hasRolePresentationOrRoleNone });
		}
		for (const svgElem of svgChildElemHandles) {
			const titleDesc = await getTitleOrDescFromSvg(svgElem);
			const ariaLabel = await checkSvgForAriaLabel(svgElem);
			const titleText = await getTitleTextfromImage(svgElem);
			const ariaLabelledBy = await checkSvgForAriaLabelledBy(svgElem, page);
			const ariaDescribedBy = await checkSvgForAriaDescribedBy(svgElem, page);
			const { hasAriaHiddenTrue } = await checkAriaHiddenIsTrue(svgElem);
			const { hasRolePresentationOrRoleNone } = await checkImageRoleForPresentationOrNone(svgElem);
			/// aria-hidden - tabindex=-1 (remove element from tab) - focusable=false (is IE)  -> think only aria-hdden is relevant. if it has title/desc/ - dont think that it will happen. 
			imageDetails.push({ imageId: imageId++, type: 'svg', titleDesc: titleDesc, ariaLabel: ariaLabel, ariaLabelledBy: ariaLabelledBy, ariaDescribedBy: ariaDescribedBy, titleText: titleText, hasAriaHiddenTrue: hasAriaHiddenTrue, hasRolePresentationOrRoleNone: hasRolePresentationOrRoleNone });
		}
	}

	  // Trim contents to remove any extraneous whitespace
	  const trimmedSlotContent = linkslotContent.trim();
	  const trimmedShadowContent = linkHasShadowDOMContent.trim();
  
	  // Initialize an array to collect valid text pieces
	  let contents = [];
  
	  // If linkTxt is non-empty, add it to contents array
	  if (linkTxtR) {
		  contents.push(linkTxtR);
	  }
  
	  // Check if slot content is non-empty and distinct from linkTxt
	  if (trimmedSlotContent && trimmedSlotContent !== linkTxtR) {
		  contents.push(trimmedSlotContent);
	  }
  
	  // Check if shadow DOM content is non-empty, distinct from linkTxt, and not a duplicate of slot content
	  if (trimmedShadowContent && trimmedShadowContent !== linkTxtR && trimmedShadowContent !== trimmedSlotContent) {
		  contents.push(trimmedShadowContent);
	  }
  
	  // Join all valid, non-duplicate contents with a space or any other delimiter as needed
	  linkTxtR = contents.join(" "); 

	  haslinkTxtR = linkTxtR !== '';


	// LOGGIN
	// if(hasImageInLink === true){
	// console.log({ linkTxt ,element, linkUrl, hasImageInLink, isNormalImage, imageIsSvg, altText, /* other data */ });
	// }
	
	// if (hasImageInLink === true) {
		// const dataString = JSON.stringify({ linkTxt, element, linkUrl, hasImageInLink, isNormalImage, imageIsSvg, imageDetails  /* other data */ }) + '\n' ;
		// const dataString = JSON.stringify({ linkTxt, element, linkUrl, hasImageInLink, isNormalImage, elementAriaLabel, elementAriaLabelledByText, elementAriaDescribedByText  /* other data */ }) + '\n' ;
		
		 
		// const dataString = JSON.stringify({ linkTxt, element, linkUrl, hasImageInLink, isNormalImage, elementAriaLabel, elementAriaLabelledByText, elementAriaDescribedByText, outerAriaContent, hasOuterAriaData, imageDetails  /* other data */ }) + '\n' ;
		// urlHrefsArr.push({  type,element,linkId,buttonOrLinkId, relAttribute,linkTxt: linkTxtR,linkUrl,isInternal,target,titleAttribute,tabindexAttribute,isOpeningNewWindow, isButton, hasTabindex, hastitleAttribute, haslinkTxtR, hasAriaDataOnElement,	elementAriaLabel, elementAriaLabelledByText, elementAriaDescribedByText, hasOuterAriaData, outerAriaContent,hasImageInLink, imageDetails  /* other data */ })
		urlHrefsArr.push({ linkHasShadowDOMContent, linkHasShadowDOM, linkslotContent, linkcontainsSlot, type,element,linkId,buttonOrLinkId, relAttribute,linkTxt: linkTxtR,linkUrl,isInternal,target,titleAttribute,tabindexAttribute,isOpeningNewWindow, isButton, hasTabindex, hastitleAttribute, haslinkTxtR, hasAriaDataOnElement,	elementAriaLabel, elementAriaLabelledByText, elementAriaDescribedByText, hasOuterAriaData, outerAriaContent,hasImageInLink, imageDetails  /* other data */ })

	
	
	
		// fs.appendFileSync('z-test-file.txt',  dataString  );
	// }



}  // End Main For Loop

/////23
}
catch {
	urlHrefsArr.push({  
	type : 'linkElement2',
	element : 'a or button',
	linkId : '0',
	buttonOrLinkId : '0',
	relAttribute :'error',
	linkTxt: 'linkTxtR',
	linkUrl: 'error',
	isInternal: false,
	target: null,
	titleAttribute: null,
	tabindexAttribute: '',
	isOpeningNewWindow: false,
	isButton: false,
	hasTabindex: false,
	hastitleAttribute: false,
	haslinkTxtR: false,
	hasAriaDataOnElement: false,
	elementAriaLabel: null,
	elementAriaLabelledByText: "",
	elementAriaDescribedByText: "",
	hasOuterAriaData: false,
	outerAriaContent: "",
	hasImageInLink: false,
	imageDetails: []  /* other data */ })

}



	


//// end Links new 


/// For P and Div with > 10 words:
// const textDetails = {
//     extractedTexts: [], // renamed from textDetails
//     combinedText: ""
// };
// const seenTexts = new Set(); // To keep track of already seen texts

// // try {
//     // Select all <p> and <div> elements from the page
//     const textElements = await page.$$('p, div');
// 	let tid = 0;
// 	for (let elem of textElements) {

// 		tid++;
//     let remainingTxtblocks = textElements.length - tid;
//     ///// sendMessageToClient(clientId, `Testing text block ${tid}/${textElements.length}. ${remainingTxtblocks} paragraph(s) left to test.`);
    
// 		// Get the full text of the current element.
// 		let rawText = await elem.textContent();  // Get the raw text of the element
	
// 		// Check for unwanted child elements.
// 		/// added img because of audioeye.com
// 		const unwantedChildren = await elem.$$('div, p, img, script, style, script[type="application/ld+json"]');
// 		for (let child of unwantedChildren) {
// 			const childText = await child.textContent();
// 			rawText = rawText.replace(childText, ' '); // Replace the unwanted child's text with a space.
// 		}
	
// 		const normalizedText = rawText.trim().replace(/\s+/g, ' '); // Normalize the text
	
// 		// Skip if text contains the word 'cookies'
// 		if (normalizedText.toLowerCase().includes('cookies')) {
// 			continue;
// 		}
	
// 		const words = normalizedText.split(' '); // Split the text by spaces to approximate word count
// 		const hasPeriod = normalizedText.includes('.'); // Check for a period
	
// 		if (words.length > 10 && !seenTexts.has(normalizedText) && hasPeriod) {
// 			const tagName = await elem.evaluate(e => e.tagName);
// 			textDetails.extractedTexts.push({
// 				type: tagName.toLowerCase(),
// 				content: normalizedText
// 			});
// 			seenTexts.add(normalizedText); // Remember this text to avoid duplicates
	
// 			// Append the normalized text to the combined text with a space separator
// 			textDetails.combinedText += normalizedText + "<br><br> ";
// 		}
// 	}/// end For Elem of TextElements loop



// 	textDetails.readabilityScores = calculateReadability(textDetails.combinedText);



	// console.log(textDetails.readabilityScores);
// } catch (error) {
//     console.error("Error while processing text elements:", error.message);
//     // You can decide to continue, retry, or abort depending on the situation
// }

// console.log(textDetails);

/// Helper function ReadAbilitY
function number_of_syllables(word) {
    word = word.toLowerCase().replace('.', '').replace('\n', '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllable_string = word.match(/[aeiouy]{1,2}/g);
    return syllable_string ? syllable_string.length : 0;
}

function calculateReadability(text) {
	///// sendMessageToClient(clientId, `Calculating readability..`);
    const words_raw = text.replace(/[.!?-]+/g, ' ').split(' ');
    const words = words_raw.filter(word => word.length > 0).length;

    const sentences_raw = text.split(/[.!?]+/);
    const sentences = sentences_raw.filter(sentence => sentence.trim() !== '').length;

    let total_syllables = 0;
    for (const word of words_raw) {
        total_syllables += number_of_syllables(word);
    }

    const characters = text.replace(/[.!?|\s]+/g, '').length;
    const pollysyllables = words_raw.filter(word => number_of_syllables(word) >= 3).length;

    const flesch_reading_ease = Math.min(100, Math.max(0, 206.835 - (1.015 * words / sentences) - (84.6 * total_syllables / words)));
    const gunning_fog_index = (words / sentences + 100 * (pollysyllables / words)) * 0.4;
    const flesch_kincaid_grade_level = (0.39 * words / sentences) + (11.8 * total_syllables / words) - 15.9;
    const automated_readability_index = 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43;
    const smog = 1.0430 * Math.sqrt(pollysyllables * 30 / sentences) + 3.1291;
    const coleman_liau = 0.0588 * (100 * characters / words) - 0.296 * (100 * sentences / words) - 15.8;

	return [
		{ name: "Flesch reading ease", value: flesch_reading_ease, desc: "Rates text on a 100-point scale; higher scores indicate easier readability. Scores between 60 and 70 are considered plain English." },
		{ name: "Gunning fog index", value: gunning_fog_index, desc: "Represents the number of years of formal education a person requires to understand a text on the first reading. A score of around 12 is acceptable for mainstream documents." },
		{ name: "Flesch Kincaid grade level", value: flesch_kincaid_grade_level, desc: "Represents the U.S. school grade level of a reader who can understand the text. For example, a score of 8.4 means an eighth grader can understand the document." },
		{ name: "Automated readability index", value: automated_readability_index, desc: "Uses character count rather than syllable count, and estimates the U.S. grade level needed to comprehend the text." },
		{ name: "Smog", value: smog, desc: "Estimates the years of education a person needs to understand a piece of writing. It's particularly used for health messages." },
		{ name: "Coleman Liau", value: coleman_liau, desc: "Relies on characters and sentence length, without the need for syllable counting. It outputs a U.S. school grade level." }
	];
	
   
} /// end Readability scores:


/// count words, count sentences count paragraphs and add classes around long sentences.

function processText(text) {
    // Split text into paragraphs
	const paragraphs = text.split(/<br\s*\/?><br\s*\/?>/);

    let numSentences = 0;
    let numWords = 0;
    let numParagraphs = paragraphs.length;

    const processedParagraphs = paragraphs.map(paragraph => {
        // Split paragraph into sentences
        const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim() !== '');

        const processedSentences = sentences.map(sentence => {
            numSentences++;
            const words = sentence.split(/\s+/).filter(word => word !== '');
            numWords += words.length;

            if (words.length > 25) {
                return `<span class="extralong">${sentence.trim()}</span>`;
            } else if (words.length > 12) {
                return `<span class="long">${sentence.trim()}</span>`;
            } else {
                return sentence.trim();
            }
        });

        return processedSentences.join('. ');  // Join sentences back together
    });

    const processedText = processedParagraphs.join('<br><br>');

    return {
        processedText: processedText,
        numSentences: numSentences,
        numWords: numWords,
        numParagraphs: numParagraphs
    };
}

 
// textDetails.transformedText = escapeHTML(processText(textDetails.combinedText).processedText);

// textDetails.transformedText =  processText(textDetails.combinedText);
// console.log(result.processedText);
// console.log('Number of Sentences:', result.numSentences);
// console.log('Number of Words:', result.numWords);
// console.log('Number of Paragraphs:', result.numParagraphs);










////////////    // For headings
    const headingDetails = [];
try {


	// const headings = await page.$$('h1, h2, h3, h4, h5, h6');
	const headingSelectors = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
	const headings = await page.$$(headingSelectors);


    let hid = 0;

	for (let heading of headings) {

		hid++;
    let remainingHeadings = headings.length - hid;
    ///// sendMessageToClient(clientId, `Testing heading ${hid}/${headings.length}. ${remainingHeadings} heading(s) left to test.`);
    
		///// // sendMessageToClient(clientId, `Testing headings...`);
        // const tagName = await heading.evaluate(e => e.tagName);
		const [tagName, text, ariaLevel, isRoleHeading, containsImage, imageDetails, containsLinkOrButton, containsSlot, slotContent] = await heading.evaluate(el => {
			const tagName = el.tagName.toLowerCase();
			const text = el.textContent.trim();

			const images = el.querySelectorAll('img, svg');
			const containsImage = images.length > 0;
			// const imageDetails = Array.from(images).map(img => ({
			// 	alt: img.alt || 'No alt',
			// 	ariaLabel: img.getAttribute('aria-label'),
			// 	ariaLabelledBy: img.getAttribute('aria-labelledby'), //// This should actually get the values from the ID.
			// 	ariaDescribedBy: img.getAttribute('aria-describedby'), /// idem
			// 	title: img.title,
			// 	role: img.getAttribute('role')
			// }));


			const imageDetails = Array.from(images).map(img => ({
				alt: img.tagName.toLowerCase() === 'img' ? img.alt || 'No alt / empty alt' : undefined,  // Only applicable for <img>
				// alt =  getAltTextfromImage(img),
				title: img.title,
				role: img.getAttribute('role'),
				ariaLabel: img.getAttribute('aria-label'),
				ariaLabelledBy: img.getAttribute('aria-labelledby') ? document.getElementById(img.getAttribute('aria-labelledby'))?.textContent || 'Label not found' : undefined,
				ariaDescribedBy: img.getAttribute('aria-describedby') ? document.getElementById(img.getAttribute('aria-describedby'))?.textContent || 'Description not found' : undefined
			}));

			const linksinheadings = el.querySelectorAll('a, button');
			const containsLinkOrButton = linksinheadings.length > 0;

			const slotinheadings = el.querySelectorAll('slot');
			const containsSlot = slotinheadings.length > 0;
			const slotContent = Array.from(slotinheadings).map(slot => {
				const slotName = slot.getAttribute('name');
				const nodes = slot.assignedNodes({flatten: true}); // Gets the distributed nodes in the slot
				const textContent = nodes.map(node => node.textContent).join("").trim(); // Joins text content of all nodes
				return {
					slotName,
					content: textContent || 'No content'
				};
			});

			const ariaLevel = el.getAttribute("aria-level") || null;
			const isRoleHeading = el.getAttribute("role") === "heading";
			return [tagName, text, ariaLevel, isRoleHeading, containsImage, imageDetails, containsLinkOrButton, containsSlot, slotContent];
		});

		// const text = await heading.textContent();
		let normalizedTagName = tagName.toLowerCase();
		let headingType = isRoleHeading ? "role" : "normal";

		if (ariaLevel) {
			normalizedTagName = `h${ariaLevel}`;
		}

        headingDetails.push({
            type: 'textElement',
            // element: tagName.toLowerCase(),
			containsSlot: containsSlot,
			slotContent: slotContent,
			containsLinkOrButton: containsLinkOrButton,
			containsImage:containsImage,
			imageDetails: imageDetails,
			element : normalizedTagName,  // new
            headingId: headingDetails.length + 1,
            headingTxt: text.replace(/\s/g, ' ').trim(),
			headingType: headingType // new
        });
    }

} catch (error) {
	headingDetails.push({
		type: 'textElement',
		containsLinkOrButton: false,
		containsImage: false,
		imageDetails: [ {
				"alt": "NA",
				"ariaLabel": null,
				"ariaLabelledBy": null,
				"ariaDescribedBy": null,
				"title": "No title",
				"role": null
			  }],
		element: 'Oeps. No value',
		headingId: '1',
		headingTxt: 'error happend. no info here.'
	});
	console.error("Error while processing headings:", error.message);
	// You can decide to continue, retry, or abort depending on the situation
}

    // For forms
	const formDetails = [];
	try {
	// const forms = await page.$$('form');
	const formsSelectors = 'form';
	const forms = await page.$$(formsSelectors);

	
	let fid = 0
	for (let form of forms) {
		console.log('Form FOUND')
		
		fid++;
    let remainingForms = forms.length - fid;
    ///// sendMessageToClient(clientId, `Testing form ${fid}/${forms.length}. ${remainingForms} form(s) left to test.`);
    console.log("remainingForms", remainingForms)
		///// // sendMessageToClient(clientId, `Testing forms...`);
		const tagName = await form.evaluate(e => e.tagName);
		const htmlContent = await form.evaluate(e => e.outerHTML);
		formDetails.push({
			type: tagName.toLowerCase(),
			formId: formDetails.length + 1,
			formHtmlCode: escapeHTML(htmlContent)
		});
	}

} catch (error) {
	formDetails.push({
		type: 'form',
		formId: '1',
		formHtmlCode: 'No html - error happend.'
	});
	console.error("Error while processing forms:", error.message);
	// You can decide to continue, retry, or abort depending on the situation
}
	




	function escapeHTML(str) {
		return str.replace(/&/g, '&amp;') // First escape ampersands
				 .replace(/</g, '&lt;')
				 .replace(/>/g, '&gt;')
				 .replace(/"/g, '&quot;')
				 .replace(/'/g, '&#39;');
	}
    // For tables
	const tables = await page.$$('table');

	const tableDetails = [];
	try {
		for (let index = 0; index < tables.length; index++) {
			let remaining = tables.length - (index + 1);  // Calculate the remaining tables
			///// sendMessageToClient(clientId, `Testing table ${index + 1}/${tables.length}. ${remaining} table(s) left to test.`);
		
			const tagName = await tables[index].evaluate(e => e.tagName);  // Should always be 'TABLE', but kept for consistency
			const htmlContent = await tables[index].evaluate(e => e.innerHTML);
		tableDetails.push({
			type: tagName.toLowerCase(),
			tableId: tableDetails.length + 1,
			tableHtmlCode: escapeHTML(htmlContent)
		});
	}

} catch (error) {
	tableDetails.push({
		type: 'table',
		tableId: '1',
		tableHtmlCode: 'No html / table to see.'
	});
	console.error("Error while processing tables:", error.message);
	// You can decide to continue, retry, or abort depending on the situation
}
	


    // For iframes
	const iframeDetails = [];
	try {
	const iframes = await page.$$('iframe');
	console.log(iframes.length);
	
	for (let index = 0; index < iframes.length; index++) {
        let remaining = iframes.length - (index + 1);  // Calculate the remaining iframes
        ///// sendMessageToClient(clientId, `Testing iframe ${index + 1}/${iframes.length}. ${remaining} iframe(s) left to test.`);
        const tagName = await iframes[index].evaluate(e => e.tagName);

		// const tagName = await iframe.evaluate(e => e.tagName);
		const srcAttr = await iframes[index].evaluate(e => e.getAttribute('src'));
		const title = await iframes[index].evaluate(e => e.getAttribute('title'));
		// let src = srcAttr;
		// if (src) {
		// 	if (src.length > 500) {
		// 		src = src.substring(0, 70) + "...";  // Truncate and add ellipsis
		// 	}
		// } else {
		// 	src = "";  // Or some default value if src is null or undefined
		// }		
		iframeDetails.push({
			type: tagName.toLowerCase(),
			iframeId: iframeDetails.length + 1,
			iframeTitle: title,
			iframeSrc: srcAttr
		});

	}
	console.log('iframeDetails', iframeDetails)

} catch (error) {
	iframeDetails.push({
		type: 'iframe',
		iframeId: '999',
		iframeTitle: 'error happend',
		iframeSrc: 'no value'
	});
	console.error("Error while processing iframes:", error.message);
	// You can decide to continue, retry, or abort depending on the situation
}


    // For landmarks
	const landmarkDetails = [];
	try {
   

		// https://a11ysupport.io/tests/html/aria/landmarks-aria-named.html
	    // Define all selectors for both native elements and their corresponding ARIA roles.
		const selectors = [
			'header', 'nav', 'main', 'article', 'aside', 'footer', 
			'[role="banner"]', '[role="navigation"]', '[role="main"]', 
			'[role="article"]', '[role="complementary"]', '[role="contentinfo"]'
		];
	
		try {
			// Query all relevant elements.
			const landmarks = await page.$$(selectors.join(', '));
			for (let landmark of landmarks) {
				const tagName = await landmark.evaluate(el => el.tagName.toLowerCase());
				const role = await landmark.evaluate(el => el.getAttribute('role') || '');
				const innerText = await landmark.evaluate(el => el.innerText || '');
				const ariaLabel = await landmark.getAttribute('aria-label');
				const ariaLabelledBy = await landmark.getAttribute('aria-labelledby');
				const ariaDescribedBy = await landmark.getAttribute('aria-describedby');
			
				let landmarkElementAriaLabelText = ariaLabel || "";
				let landmarkElementAriaDescribedByText = await getContentForAriaAttributes(ariaDescribedBy, page);
				let landmarkElementAriaLabelledByText = await getContentForAriaAttributes(ariaLabelledBy, page);
			

				  // Aggregate all available label information
				  let landmarkLabel = [
					ariaLabel,
					landmarkElementAriaLabelledByText,
					landmarkElementAriaDescribedByText
				].filter(label => label).join(', '); // Only add if the label has content and join with a comma
	
				// Construct the landmark element description
				let description = `${tagName} - label: ${landmarkLabel}`;
				if (role) {
					description = `${tagName} - role: ${role} - label: ${landmarkLabel}`; // Append role and label for elements with specific roles
				}

			
 
	
				// Push the details to the landmark details array
				landmarkDetails.push({
					type: 'signpostLandmark',
					landmarkId: landmarkDetails.length + 1,
					landmarkelement: description,
					landmarkhtml: innerText
				});
			}
		} catch (error) {
			console.error("Error retrieving landmarks:", error);
		}
	
		console.log(landmarkDetails);


	///



} catch (error) {
	landmarkDetails.push({
		type: 'signpostLandmark',
		landmarkId: '999',
		landmarkelement: 'error happend.',
		landmarkhtml: 'No value due to errors'
	});
	console.error("Error while processing landmarks:", error.message);
	// You can decide to continue, retry, or abort depending on the situation
}

const contentLenghts = {
	headingLenght : headingDetails.length,
	linksLenght : urlHrefsArr.length,
	imageLenght : imageDetails.length,
	formsLenght : formDetails.length,
	tablesLenght : tableDetails.length,
	landmarksLenght : landmarkDetails.length,
	iframesLenght  : iframeDetails.length,
}

    // Accessibility snapshot
    // const accessibilitySnapshot = await page.accessibility.snapshot();

    // Combine all details
    const totalDetails = [
		...pageDetails,
        ...imageDetails,
		// ...textDetails.extractedTexts, // Use the nested array inside textDetails
		// textDetails.combinedText, ////This will add the combined text as a single string entry
		// { type: 'combinedText', content: textDetails.combinedText },
		// { readabilityScores:  textDetails.readabilityScores },
		// { newsentences: textDetails.transformedText},
		{ contentLengts : contentLenghts},
        // ...linkDetails,
		...urlHrefsArr,
        ...headingDetails,
        ...formDetails,
        ...tableDetails,
        ...iframeDetails,
        ...landmarkDetails,
        // accessibilitySnapshot ///// depricated by playwright.
    ];
	// totalDetails.push({ type: 'combinedText', content: textDetails.combinedText });
    return totalDetails;
};


// module.exports = axeContent;
export default axeContent;