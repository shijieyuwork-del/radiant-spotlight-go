import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  fields?: Array<[string, string]>
  adminLink?: string
}

const ADMIN_LINK = 'https://celadonchina.com/admin/content'

const QuoteRequestEmail = ({ fields = [], adminLink = ADMIN_LINK }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New consultation request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New consultation request</Heading>
        <table cellPadding={6} style={table}>
          <tbody>
            {fields.map(([label, value]) => (
              <tr key={label}>
                <td style={labelCell}>
                  <strong>{label}</strong>
                </td>
                <td style={valueCell}>{value || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Text style={{ marginTop: '16px' }}>
          <Link href={adminLink}>Open the admin console</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteRequestEmail,
  subject: (data: Record<string, any>) =>
    `New consultation request — ${data.name || 'Unknown'}${data.procedure ? ` (${data.procedure})` : ''}`,
  displayName: 'Consultation request (admin notice)',
  previewData: {
    name: 'Jane Doe',
    procedure: 'Double eyelid surgery',
    adminLink: ADMIN_LINK,
    fields: [
      ['Name', 'Jane Doe'],
      ['Email', 'jane@example.com'],
      ['Procedure', 'Double eyelid surgery'],
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif', color: '#1c2b2b' }
const container = { padding: '20px 25px' }
const heading = { margin: '0 0 12px', fontSize: '20px' }
const table = { borderCollapse: 'collapse' as const, fontSize: '14px' }
const labelCell = { border: '1px solid #e4e9e9', background: '#f6f9f8' }
const valueCell = { border: '1px solid #e4e9e9' }
