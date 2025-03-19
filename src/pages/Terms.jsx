import ReactGA from "react-ga4";
import { useEffect } from "react";

const Terms = () => {
	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Terms" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="mx-10 sm:mx-16 my-6 sm:my-10">
			<h6 className="text-4xl text-center font-bold mb-2 sm:mb-6">Terms and Conditions</h6>
			<div className="flex flex-col gap-4">
				<ul className="flex flex-col gap-4  font-semibold">
					<li>
						<p className="text-xl font-semibold mb-1">A. Introduction</p>
						<p className="text-justify sm:leading-7">
							Welcome to PHYSIOPLUS HEALTHCARE. These Terms and Conditions govern your use of our website
							[www.physioplushealthcare.com] and services, including the listing and booking of physiotherapy services,
							membership plans for mental health, physical health, and diet plans, and other related services.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold  mb-1">B. Acceptance of Terms</p>
						<p className="text-justify sm:leading-7">
							By accessing and using our website, both users and physiotherapists agree to be bound by these Terms and
							Conditions and our Privacy Policy.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">C. Service Description</p>
						<p className="text-justify sm:leading-7">
							www.physioplushealthcare.com provides a platform for users to connect with registered physiotherapists and
							avail of various health and wellness plans. Users can book appointments, purchase memberships, and access
							health assessments for a fee.
						</p>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">General</p>
					<li className="list-disc list-inside">
						The www.physioplushealthcare.com Website is owned, hosted and maintained by Physio plus Healthcare Private
						Limited. (hereinafter referred to as Physio plus).
					</li>
					<li className="list-disc list-inside">
						www.physioplushealthcare.com is a Website created by Physio plus Healthcare Private Limited, which merely
						facilitates the interaction between its users/customers and Licensed, Registered Medical Physiotherapy
						Doctors through the website of Physio plus.
					</li>
					<li className="list-disc list-inside">
						Physioplus acts as a platform, through Website, for facilitating mobile healthcare advice through licensed
						and Registered Medical Physiotherapist Professionals who offer medical tele-consultation services and clinic
						appointment booking over the mobile phone, computer, and I pad, etc.
					</li>
					<li className="list-disc list-inside">
						Physioplus is not intended to replace a physical visit to a Physio Doctor at his/her clinic/hospital for a
						medical examination.
					</li>
					<li className="list-disc list-inside">
						Physioplus does not validate, concur, corroborate, approve, accept or recommend any information or content
						posted, discussed or exchanged between the Participating Medical Professionals and You/end user and shall
						not be responsible much less liable for the same.
					</li>
					<li className="list-disc list-inside">
						Nor is Physioplus intended to treat a medical emergency or medical condition. If you think you may have a
						medical emergency, visit your Doctor/Hospital or call local emergency services immediately.
					</li>
					<li className="list-disc list-inside">
						Advice provided by the medical professionals through Physioplus is based on the symptoms/allergies/long term
						condition and should be used merely as a guide rather than a definitive recommendation to adopt any specific
						action or treatment.
					</li>
					<li className="list-disc list-inside">
						Any consultation is initiated by You. Only when you reach out to consult and treatment a participating
						medical professional through Physioplus will any participating medical professional engage with You. No
						interaction on this website constitutes the establishment of a doctor-patient relationship between you and
						any participating medical professional providing information or advice through the app and website.
					</li>
					<li className="list-disc list-inside">
						You agree to the limitations associated with consultations in the absence of a physical examination or at
						clinic and other.
					</li>
					<li className="list-disc list-inside">
						You further absolve from all liability, Physioplus and its owners, managers, directors, employees, agents,
						partners, advertisers and/ or affiliates from any legal responsibility for any incorrect or misleading
						information provided by any participating professional or contained within the app and website.
					</li>
					<li className="list-disc list-inside">
						The information on this App & Website (including but not limited to telephonic & video consult, emails)is
						provided for general informational purposes only and SHOULD NOT be relied upon as a substitute for sound
						professional medical advice, evaluation or care from your physio or any other qualified healthcare provider.
					</li>
					<li className="list-disc list-inside">
						Physioplus does not recommend or endorse any specific tests, procedures, opinions, or other information that
						may be mentioned on the Site. Reliance on any information provided by any participating medical
						physiotherapist professional through the App & Website is solely at Your own risk.
					</li>
					<li className="list-disc list-inside">
						By registering, subscribing or using this Physioplus Application or any Service of Physioplus on the
						Application or website, you signify your agreement to these terms of use. If you do not agree to these Terms
						of Use, please do not use this Application or Service.
					</li>
					<li className="list-disc list-inside">
						Physioplus reserves the right, in its discretion, to change or modify all or any part of this Agreement at
						any time, effective immediately. Your continued use of the Physioplus Application or Service constitutes
						your binding acceptance of these terms and conditions, including any changes or modifications made by
						Physioplus as permitted above. Please be sure to review this Agreement periodically to ensure familiarity
						with the most current version. If at any time the terms and conditions of this Agreement are no longer
						acceptable to you, you should immediately cease all use of the Service.
					</li>
					<li className="list-disc list-inside">
						Physioplus does not permit registration by and will not knowingly collect personally identifiable
						information from anyone under 14 on this Application. By registering for the Service, you represent and
						warrant that you are 14 years of age or older, as on date of this agreement and that you have fully read and
						understood the Terms and Conditions as set forth in this agreement, without any impairment in judgment
						resulting from (but not limited to) mental illness, mental handicap, intoxication, medication, or any other
						health or other problem that could impair judgment. Additionally, you must provide true, accurate and
						complete registration information to become a member of the Service (“Member”). Creating a Member account
						under automated means or under false or fraudulent pretence constitutes unauthorised use of the Service and
						such accounts will be terminated by Physioplus Healthcare Private Limited If you are under 14 please refer
						the guardian with you.
					</li>
					<li className="list-disc list-inside">
						By using the Service, you represent and warrant that all registration information you submit is truthful and
						accurate and you agree to the accuracy of such information. The profile that you compose upon registering
						for the Service (the “Member Profile”) must describe you, an individual person. Examples of inappropriate
						profiles include, but are not limited to, profiles that purport to represent an animal, place, inanimate
						object, fictional character, or real individual who is not you. If you wish to view or change your profile,
						you can do so via the “my profile” or “my account” option on the website.
					</li>
					<li className="list-disc list-inside">
						You agree to pay any charges incurred in connection with the Service you elect to purchase from Physioplus
						at the rates in effect when the charges were incurred. If you’ve elected to pay by credit card, we will bill
						all charges to your credit card upon receipt of purchase or payment form..
					</li>
					<li className="list-disc list-inside">
						If you believe someone has accessed the Application or Website using your username and password without your
						authorisation, you must contact Physioplus Healthcare Private Limited by mailing us at
						support@physioplushealthcare.com
					</li>
					<li className="list-disc list-inside">
						We will make all reasonable attempts to contact you when your purchased subscription plan is due to expire,
						and offer a simple process for renewing your subscription. If your subscription expires before you accept
						our renewal offer, your access to the Service and all of its services will terminate without additional
						notice. Any special offers or discounts obtained upon your initial subscription or any subsequent renewals
						may not necessarily be offered on renewal, and we reserve the right to change our subscription fees at any
						time without notice.
					</li>
					<li className="list-disc list-inside">
						For any medical emergency, you would immediately contact the local emergency number in your country.
					</li>
					<li className="list-disc list-inside">
						Information or advice provided on the Site or through the Application Physioplus, by professionals should be
						used merely as a guide rather than a definitive recommendation to adopt any specific action or treatment.
						Nothing transmitted to or from this Site constitutes the establishment of a doctor-patient relationship
						between you and any professional providing information or advice through the site. The site is not intended
						to diagnose a medical condition.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Use of Content</p>
					<li>
						2.1 The Application provides general medical-related advice from Licenced and Registered Medical
						Physiotherapist Practitioners only and does not constitute legal advice.
					</li>
					<li>
						2.2 You acknowledge that the Application and website contains information, software, photographs, audio and
						video clips, graphics, links and other material of Physioplus Healthcare Pvt. Ltd.(collectively, the
						“Content”) that is protected by copyright, trademark or other proprietary rights of Physioplus or third
						parties. All Content on the Application is copyrighted as a collective work of Physiopus as per applicable
						copyright law. You agree to comply with any copyright notices, information, or restrictions contained in any
						Content available on or accessed through the Service. Users of the Application may use the Content only for
						their personal, non-commercial use..
					</li>
					<li>
						2.3 You may not modify, publish, transmit, reproduce, create derivative works from, distribute, perform,
						display, sell, transfer or in any way exploit any of the Content or Material, in whole or in part. Content
						consisting of downloadable software may not be reverse engineered unless specifically authorized by the
						owner of the software’s patent and/or copyright. You also agree not to circumvent, disable or otherwise
						interfere with any security related features of the Application or the Content, including features that
						prevent or restrict use or copying or those that enforce limitations on use.
					</li>
					<li>
						2.4 You are NOT allowed to DOWNLOAD or copy and make any personal, non-commercial or commercial use of the
						Content or information from the Application in whole or in part without the express permission of Physioplus
						Healthcare Private Limited. Requests for such permission should be made on info@physioplushealthcare.com.
						Any rights not expressly granted herein are reserved. Please be advised that Physioplus Healthcare Private
						Limited enforces its intellectual property rights to the fullest extent of the law.
					</li>
					<li>
						2.5 It is your responsibility to check the accuracy or relevant facts and opinions given on the Application
						or website before entering into any commitment based upon them.
					</li>
					<li>
						2.6 Upon download and installation of the Application, you grant the following permissions to the
						Applications to perform the following actions on the device You have installed the Application in.
						<ul>
							<li>
								(i) To read from, write on, modify and delete data pertaining to the Application on the device’s hard
								disk and/or external storage;
							</li>
							<li>
								(ii) To access information about networks, your mail ID, access networks including Wi-Fi networks,
								receive and send data through the network;
							</li>
							<li>
								(iii) To determine Your approximate & exact location from sources like, but not limited to mobile
								towers, GPS and connected Wi-Fi networks;
							</li>
							<li>
								(iv) To access the model number, IMEI number and details about the operating system of the device the
								Application has been installed on, as well as the phone number of the device.
							</li>
							<li>
								(v) To retrieve information about other Applications running on the device the Application has been
								installed on and open them.
							</li>
							<li>
								(vi) To detect when the phone had been switched off and switched on for the purpose of sending
								notification/ push notifications.
							</li>
						</ul>
					</li>
					<li>
						2.7 From time to time, the Application may automatically check the version of the installed Application on
						the Device and, if applicable, provide updates for the Application (hereinafter referred to as “Updates”).
						Updates may contain, without limitation, bug fixes, patches, enhanced functionality, plug-ins and new
						versions of the Application. By installing the Application, You authorize the automatic download and
						installation of Updates and agree to download and install Updates manually if necessary. Your use of the
						Application and Updates shall be governed by this Agreement (as amended by any terms and conditions that may
						be provided with Updates).
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Rules of conduct</p>
					<li>
						3.1 If you have registered on the Application or Website, the log in credentials are personal to the
						individual named on the account and cannot be shared with or used by any other individual, or entity. The
						sharing of passwords, login information, or user identification is forbidden. PHYSIOPLUS reserves the right
						to monitor Customer’s use of the Application to ensure compliance with this Agreement and prevent fraudulent
						use. Such monitoring of use may include but will not be limited to determining whether or not the
						Application is accessed under the account from multiple sources or IP Addresses at the same time.
					</li>
					<li>
						3.2 If you have registered on the Application, the log in credentials are personal to the individual named
						on the account and cannot be shared with or used by any other individual, or entity. The sharing of
						passwords, login information, or user identification is forbidden. PHYSIOPLUS reserves the right to monitor
						Customer’s use of the Application to ensure compliance with this Agreement and prevent fraudulent use. Such
						monitoring of use may include but will not be limited to determining whether or not the Application is
						accessed under the account from multiple sources or IP Addresses at the same time.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Call & IP Logs</p>
					<li>
						5.1 We maintain standard call and IP logs that record data about all visitors and customers who call us
						and/or access our Application. We store this information for providing services and as an analysis tool for
						our physicians. All call logs are stored securely, and may only be accessed by PHYSIOPLUS employees or
						designees on a need-to-know basis for a specific purpose. PHYSIOPLUS uses call log information to help
						provide our members the efficient services under this membership. We collect IP address of all visitors to
						the Application, and a number is automatically assigned to your computer whenever you access the Internet.
						We collect IP address information in order to administer our system and gather aggregate information, to
						avoid any scope of misuse of the Application. The information may be shared with advertisers, sponsors and
						other businesses.
						<ul>
							<li className="list-inside list-disc">
								Use the Application for any commercial purpose, to distribute any advertising or solicitation of funds
								or goods and services, or to solicit users to join competitive online services;
							</li>
							<li className="list-inside list-disc">
								Post on the Application any links to any external Internet Application or mobile Applications that are
								obscene or pornographic, or display pornographic or sexually explicit material of any kind;
							</li>
							<li className="list-inside list-disc">
								Reformat or frame any portion of any web page that is part of the Application;
							</li>
							<li className="list-inside list-disc">
								Post Material containing restricted or password only access pages, or hidden pages or images (those not
								linked to or from another accessible page);
							</li>
							<li className="list-inside list-disc">
								Submit any Material that falsely implies sponsorship of that Material by the Application and/or
								PHYSIOPLUS, falsify or delete any author attributions in any Materials, or promote any information that
								you know is false or misleading transmit any viruses, worms, defects, Trojan horses or other items of a
								contaminating or destructive nature through the Application;
							</li>
							<li className="list-inside list-disc">
								Submit Material that violates the rights of others, such as Material that infringes any copyright,
								trademark, patent, trade secret or violates any right of privacy or publicity, or that is libellous or
								defamatory, or that directs any user, by linking or any other method, to the content of a third party
								without the third party’s written consent; promote an illegal or unauthorised copy of another person’s
								copyrighted work, such as providing pirated computer programs or videos or links to them, providing
								information to circumvent manufacture-installed copy-protect devices, or providing pirated music or
								links to pirated music files; or submit material that is libellous, defamatory, obscene, pornographic,
								abusive, harassing, threatening, unlawful or promotes or encourages illegal activity.
							</li>
						</ul>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Managing Content</p>
					<li>
						4.1 PHYSIOPLUS reserves the right to delete, move or edit any Content (including Material posted in any
						interactive area of the Application) that it may determine, in its sole discretion, violates this Agreement
						or is otherwise unacceptable. However, PHYSIOPLUS does not and cannot review all of the Content posted by
						users on the Application and is not responsible for such Content. You shall remain solely responsible for
						all Material. Although PHYSIOPLUS reserves the right to remove any offending Content on the Application, you
						understand and agree that you nonetheless may be exposed to such Material and that you further waive your
						right to any damages (from any party) related to such exposure.
					</li>
					<li>
						4.2 Additionally, PHYSIOPLUS shall have the right, but not the obligation, to correct any errors or
						omissions in any Content, as it may determine in its sole discretion. .
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">No Endorsement</p>
					<li>
						5.1 PHYSIOPLUS does not represent or endorse the accuracy or reliability of any Content posted on any
						interactive area and you acknowledge that any reliance upon such Content shall be at your sole risk. Any
						Content placed on any interactive area by users represents the views of the user posting the statement, and
						does not represent the views of PHYSIOPLUS.
					</li>
					<li>
						5.2 The Service may contain links to Application or mobile Applications on the Internet which are owned and
						operated by third parties (the “External Application or mobile Applications”). You acknowledge that
						PHYSIOPLUS is not responsible for the availability of, or the content located on or through, any External
						Application or mobile Application. You should contact the Application or mobile Application administrator or
						webmaster for those External Application or mobile Applications if you have any concerns regarding such
						links or the content located on such External Application or mobile Applications.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Indemnity</p>
					<li>
						6.1 You agree to indemnify, defend and hold PHYSIOPLUS and its affiliates, and their respective officers,
						directors, owners, agents, information providers and licensors (collectively, the “PHYSIOPLUS Parties”)
						harmless from and against any and all claims, liability, losses, damages, costs and expenses (including
						attorneys’ fees) incurred by any PHYSIOPLUS Party in connection with any Material or with use or alleged use
						of any Content or the Application, including any use under your password by any person, whether or not
						authorized by you. PHYSIOPLUS reserves the right, at its own expense, to assume the exclusive defence and
						control of any matter otherwise subject to indemnification by you, and in such case, you agree to cooperate
						with PHYSIOPLUS'S defence of such claim.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Termination of Application Access</p>
					<li>
						7.1 PHYSIOPLUS reserves the right, in its sole discretion, to restrict, suspend or terminate your user
						account and access to all or any part of the Application, including the discussion areas, at any time for
						any reason without prior notice or liability. Conversely, you may terminate your user account at any time,
						for any reason, by deleting your account on the Application or by emailing PHYSIOPLUS at
						Support@physiopluspvtltd.com. The terms of this Agreement shall survive any termination of your membership.
						PHYSIOPLUS may change, suspend or discontinue all or any aspect of the Application at any time, including
						the availability of any feature, database, or Content (including the discussion areas), without prior notice
						or liability.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Payments</p>
					<li>
						8.1 PHYSIOPLUS may use a third-party payment gateway to process your payments when you purchase a Service on
						the Application. All such transactions are secured and encrypted. When you make a payment, you will be
						redirected to the third-party payment gateway and on successful completion of payment, a payment receipt
						will be generated for your records. In case there is a payment failure, no charges will be debited and you
						will be notified about the payment failure. Although it is not mandatory that you register or create a user
						account on the Application to make payments, it is advisable to do so for your own convenience. Detailed
						information on eligibility for cancellation and refund of any payments made can be found under our ‘Refund &
						Cancellation’ Policy.
						<ul>
							<li className="list-disc list-inside">
								Physioplus will not pay any fees to PHYSIOTHERAPIST for providing clinic consultation.
							</li>
							<li className="list-disc list-inside">
								Physioplus charge 99 INR.+ gst from Physiotherapist for every home consultation, and tele consultation
								patient referral.
							</li>
							<li className="list-disc list-inside">
								All Payment will be processed through a third-party payment gateway.
							</li>
						</ul>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Copyright Policy</p>
					<li>
						9.1 You may not post, distribute, perform, display, transmit or reproduce in any way any copyrighted
						material, trademarks, or other proprietary information without obtaining the prior written consent of the
						owner of such proprietary rights. Without limiting the foregoing, if you believe that your work has been
						copied and posted on the Service in a way that constitutes copyright or trademark infringement, please
						contact the Application administrator at info@physioplushealthcare.com with the following information:
						<ul>
							<li>
								(a) an electronic or physical signature of the person authorized to act on behalf of the owner of the
								copyright or trademark interest;
							</li>
							<li>(b) a description of the copyrighted work(s) or trademark(s) that you claim has been infringed;</li>
							<li>
								(c) a description of where the material that you claim is infringing is located on the Application;
							</li>
							<li>(d) your address, telephone number, and email address;</li>
							<li>
								(e) a written statement by you that you have a good faith belief that the disputed use is not authorized
								by the copyright or trademark owner, its agent, or the law; and
							</li>
							<li>
								(f) a statement by you, made under penalty of perjury, that the above information in your notice is
								accurate and that you are the copyright or trademark owner or authorized to act on the copyright or
								trademark owner’s behalf.
							</li>
						</ul>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">LIMITATION OF LIABILITY & WARRANTY DISCLAIMER</p>
					<li>
						10.1 PHYSIOPLUS, its suppliers, and other third parties mentioned on this Application are neither
						responsible nor liable for any direct, indirect, incidental, consequential, special, exemplary, punitive, or
						other damages (including, without limitation, those resulting from lost profits, lost data, or business
						interruption) arising out of or relating in any way to the Application, Application-related services and
						products, content or information contained within the “Application,” and/or any hyperlinked Application,
						whether based on warranty, contract, tort, or any other legal theory and whether or not advised of the
						possibility of such damages. Your sole remedy for dissatisfaction with the Application, Application-related
						services, and/or hyperlinked Applications is to stop using the Application and/or those services. Applicable
						law may not allow the exclusion or limitation of incidental or consequential damages, so the above
						limitation or exclusion may not apply to you.
					</li>
					<li>
						10.2 This Application and its content and Application-related services are provided “as is,” with all
						faults, with no representations or warranties of any kind, either expressed or implied, including, but not
						limited to, the implied warranties of merchantability, fitness for a particular purpose, and
						non-infringement. You assume total responsibility and risk for your use of this Application,
						Application-related services, and hyperlinked Applications. No oral or written information or advice given
						by neither PHYSIOPLUS nor its authorized representatives shall create a warranty nor in any way increase the
						scope of this warranty. Neither PHYSIOPLUS nor any third party content provider warrants that any files
						available for downloading through this Application will be free of viruses or similar contamination or
						destructive features.
					</li>
					<li>
						10.3 Please note that a small number of people may experience epileptic seizures when exposed to certain
						light patterns on a computer screen like those displayed when using the Application. Consult your physician
						prior to using the Application if you have had any epileptic symptoms (such as eye or muscle twitches,
						dizziness, altered vision, dis-orientation, loss of awareness, involuntary movements or convulsions) and
						discontinue use of the Application immediately if you experience any such symptoms.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Viruses</p>
					<li>
						11.1 While efforts have been taken to ensure that the pages on the Application are free from viruses,
						PHYSIOPLUS gives no warranties that they are indeed free from viruses and users are responsible for ensuring
						that they have installed adequate virus checking software
					</li>
					<li>
						11.2 PHYSIOPLUS excludes, in so far as it is legally responsible, all liability and responsibility (other
						than liability for death or physical injury arising out of the negligence of PHYSIOPLUS or its officers) for
						any viruses or any other computer code, files or programs designed to interrupt, restrict, destroy, limit
						the functionality of or compromise the integrity of any computer software or hardware or telecommunications
						equipment or other material transmitted with or as part of.
					</li>
					<li>
						The pages on the Application or any other Internet Application or mobile Applications;- Any material
						downloaded from the Application or any other Internet Application:– Any publication, product or service.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Intellectual Property</p>
					<li>
						12.1 The names, images and logos identifying PHYSIOPLUS or third parties and their products and services,
						are the proprietary marks of PHYSIOPLUS, and/or may be the proprietary marks of third parties. Any use made
						of these marks may be an infringement of rights in those marks and PHYSIOPLUS reserves all rights to enforce
						such rights that it might have.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Refunds & Cancellation</p>
					<li>
						13.1 No Refunds or Cancellations are allowed once a payment has been made and the Service has been provided.
						For cancellations that are made before a Service has been attempted to be provided, no refunds are allowed,
						and any payment(s) made can only be adjusted against any future Service, irrespective of the service type.
						In cases of disputed Service, any cancellation or refund will only be considered on a case to case basis.
						All such requests for Cancellation or Refunds should be made in writing and addressed to the
						info@physioplushealthcare.com Please note that the above Refund & Cancellation Policy is applicable to all
						payments made through the online payment gateway on this Application
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Jurisdiction & Miscellaneous</p>
					<li>
						14.1 The Application or mobile Application has been created with Indian users in mind and therefore its
						content may not be appropriate or lawful outside of INDIA. Users from outside of INDIA should therefore
						verify for themselves whether or not it is appropriate for them to access the Application or Services:
						<ul>
							<li className="list-inside list-disc">
								This Agreement sets forth the entire agreement between you and PHYSIOPLUS with respect to the Terms &
								Condition of Use (TOU) mentioned here and shall supersede all prior understandings or agreements,
								whether oral or in writing, between you and PHYSIOPLUS as regards to the subject matter herein.
							</li>
							<li className="list-inside list-disc">
								This Agreement sets forth the entire agreement between you and PHYSIOPLUS with respect to the Terms &
								Condition of Use (TOU) mentioned here and shall supersede all prior understandings or agreements,
								whether oral or in writing, between you and PHYSIOPLUS as regards to the subject matter herein.
							</li>
							<li className="list-inside list-disc">
								Jurisdiction of Disputes: THIS AGREEMENT SHALL BE GOVERNED BY AND CONSTRUED IN ACCORDANCE WITH LAWS OF
								INDIA. ANY DISPUTE ARISING FROM OR IN CONNECTION WITH THIS AGREEMENT, WHICH CANNOT BE SETTLED AMICABLY
								BETWEEN YOU AND TRAKTION WITHIN 30 DAYS FROM THE DATE OF A NOTICE OF DISPUTE FROM ONE PARTY TO THE
								OTHER, SHALL BE REFERRED TO AN ARBITRATION OF THE SOLE ARBITRATOR TO BE APPLICATIONOINTED IN ACCORDANCE
								WITH THE PROVISIONS OF ARBITRATION AND CONCILIATION ACT, 1996. THE ARBITRATION SHALL BE CONDUCTED IN
								ENGLISH AND VENUE SHALL BE NEW DELHI. ANY ACTION OR SUIT RELATED TO THIS AGREEMENT SHALL BE SUBJECT TO
								THE EXCLUSIVE JURSIDICTION OF THE COURTS IN NEW DELHI, INDIA. If any inconsistency exists between the
								terms of this Agreement and any additional terms and conditions posted on the Service, such terms shall
								be interpreted as to eliminate any inconsistency, if possible, and otherwise, the additional terms and
								conditions shall control. If any provision of this Agreement is held invalid, illegal or unenforceable
								in any respect,
								<ul>
									<li>
										(i) such provision shall be interpreted in such a manner as to preserve, to the maximum extent
										possible, the intent of the parties,
									</li>
									<li>
										(ii) the validity, legality and enforceability of the remaining provisions shall not in any way be
										affected or impaired thereby, and
									</li>
									<li>
										(iii) such decision shall not affect the validity, legality or enforceability of such provision
										under other circumstances.
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Disclosures</p>
					<li>
						15.1 PHYSIOPLUS may disclose personal information to any person performing audit, legal, operational, or
						other services for us. We will use Information which does not identify the individual for these activities
						whenever feasible.
					</li>
					<li>
						15.2 We may disclose personal information when required to do so by a subpoena, court order, or search
						warrant. We may disclose personal information as we deem it appropriate to protect the safety of an
						individual or for an investigation related to public safety or to report an activity that appears to be in
						violation of law. We may disclose personal information to protect the security and reliability of this
						service and to take precautions against liability.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">No Guarantee</p>
					<li>
						16.1. Despite our use of commercially reasonable efforts to protect your personal information from
						unauthorized access or disclosure, the Internet is not an inherently secure environment and so we cannot
						guarantee the security of your information. We assume no liability for any disclosure of data due to errors
						in transmission, unauthorized third party access or other acts of third parties, or acts or omissions beyond
						our reasonable control.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Copyrights</p>
					<li>
						17.1 Except as otherwise indicated, all content on this Application, including text, graphics, logos, button
						icons, photos, images, forms, audio, video, questionnaires, “look and feel” and software, is the property of
						PHYSIOPLUS and/or its licensors and is protected by India and international copyright laws. The compilation
						of all content on this Application is the exclusive property of PHYSIOPLUS and/or its licensors and is
						protected by India and international copyright laws. Unless specifically authorized in writing by
						PHYSIOPLUS, any use of these materials, or of any materials contributed to this Application by entities
						other than PHYSIOPLUS on any other Application or networked computer environment for any purpose is
						prohibited. All rights reserved for all countries. Any rights not expressly granted by these terms and
						conditions or any applicable end-user license agreements are reserved by PHYSIOPLUS. The materials provided
						by this Service may be downloaded and/or reprinted for personal use only. Permission to reprint or
						electronically reproduce any document or graphic in whole or in part for any reason is expressly prohibited,
						unless prior written consent is obtained from the copyright holder(s).
					</li>
					<li>17.2. Infected or Corrupted Materials</li>
					<li>
						17.3 You also understand that the Provider cannot and does not guarantee or warrant that files available for
						downloading through the Service will be free of infection or viruses, worms, Trojan horses or other code
						that manifest contaminating or destructive properties. Each Member is responsible for implementing
						sufficient procedures and checkpoints to satisfy his or her particular requirements for accuracy of data
						input and output, and for maintaining a means external to the Service for the reconstruction of any lost
						data. The Provider does not assume any responsibility or risk for your use of the Service.
					</li>
					<li>
						17.4 We will occasionally amend this Policy. Please ensure that you periodically update yourself with the
						current version of the Privacy Policy.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Questions, Complaints & Contacts</p>
					<li>
						18.1 If you have any questions about TERMS AND CONDITION and agreement, including your rights under this
						document, you can contact PHYSIOPLUS HEALTHCARE PRIVATE LIMITED by telephone +91 8107333576, by sending an
						e-mail message to support@physioplushealthcare.com by post at the address PHYSIOPLUS HEALTHCARE PRIVATE
						LIMITED 109, 1st Floor, Sankalp Tower, Khatipura Road, Jaipur, Rajasthan 302012.
					</li>
				</ul>
			</div>
		</div>
	);
};
export default Terms;
