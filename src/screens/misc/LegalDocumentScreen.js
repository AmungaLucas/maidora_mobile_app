import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

// These are prototype explanations, not approved legal documents.
// Replace with reviewed, complete policies before launching Maidora publicly.
const DOCUMENTS = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Prototype summary — not the final legal terms.',
    sections: [
      ['Using Maidora', 'Maidora is being developed as a marketplace to help domestic workers and employers discover one another. Creating an account does not guarantee work, a placement, or a particular outcome.'],
      ['Account information', 'You are responsible for providing accurate information and keeping your login credentials private. Do not impersonate another person or use another person’s account.'],
      ['Respectful and lawful use', 'Users must communicate respectfully and must not use Maidora to harass, discriminate, defraud, exploit, or otherwise harm others.'],
      ['Demo limitations', 'This version is a demonstration. Authentication, messaging, identity checks, payments, and other services may be simulated or unavailable. Do not submit real identity documents or payment details in this demo.'],
      ['Before launch', 'The final terms must explain the parties’ responsibilities, marketplace rules, complaints process, liability, termination, governing law, and contact details after legal review.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Prototype summary — the complete policy is still being prepared.',
    sections: [
      ['Information the app may use', 'Account details such as your name, phone number, and email address; profile and marketplace information you choose to provide; and location information when you grant foreground location permission.'],
      ['Why information is used', 'To create and manage accounts, support marketplace discovery, help users communicate, improve safety, and operate the service. The final policy must specify each purpose and its applicable lawful basis.'],
      ['Location', 'The intended app experience uses foreground location only. You can choose manual location entry if device location is unavailable or permission is declined.'],
      ['Sharing, storage and retention', 'The production policy must identify service providers and other recipients, explain safeguards, state retention periods, and describe any transfers outside Kenya. Those details have not yet been finalised for this demo.'],
      ['Your choices and rights', 'The final policy will explain how to access, correct, or request deletion of personal information, manage permissions, and contact Maidora with a privacy concern.'],
    ],
  },
  dataProtection: {
    title: 'Data Protection Notice',
    subtitle: 'Prototype summary — confirm the final notice with a qualified reviewer.',
    sections: [
      ['Data controller', 'The legal name and contact details of the organisation responsible for Maidora must be inserted here before public launch.'],
      ['Data collected', 'Depending on the features used, this may include contact details, profile information, location, messages, and information submitted for identity verification.'],
      ['Purpose and lawful basis', 'The final notice must map each category of personal data to its specific purpose and lawful basis under applicable data protection law.'],
      ['Your data protection rights', 'The final notice must explain the rights available to data subjects, how to exercise them, and how to raise a complaint with the relevant authority.'],
      ['Contact', 'A monitored privacy contact address and the organisation’s postal or other required contact details must be added before launch.'],
    ],
  },
};

export default function LegalDocumentScreen({ navigation, route }) {
  const document = DOCUMENTS[route.params?.documentType] || DOCUMENTS.terms;

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Text style={styles.eyebrow}>MAIDORA · DOCUMENT PREVIEW</Text>
      <Heading title={document.title} subtitle={document.subtitle} />
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Important: prototype content</Text>
        <Text style={styles.noticeText}>
          This is an explanatory draft for testing the app flow. It is not a complete or legally approved policy and must be reviewed and completed before Maidora is made available to the public.
        </Text>
      </View>
      {document.sections.map(([heading, body]) => (
        <View key={heading} style={styles.section}>
          <Text style={styles.sectionTitle}>{heading}</Text>
          <Text style={styles.sectionBody}>{body}</Text>
        </View>
      ))}
      <Button title="Back to account setup" secondary onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  eyebrow: { color: colors.forest, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  notice: { backgroundColor: colors.warning, borderRadius: 12, padding: 14, marginBottom: 18 },
  noticeTitle: { color: colors.ink, fontSize: 13, fontWeight: '900', marginBottom: 5 },
  noticeText: { color: colors.ink, fontSize: 12, lineHeight: 19 },
  section: { marginBottom: 18 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', marginBottom: 6 },
  sectionBody: { color: colors.muted, fontSize: 13, lineHeight: 21 },
});
