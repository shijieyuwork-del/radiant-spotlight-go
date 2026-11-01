import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PROCEDURE_CATALOG } from '@/data/procedureCatalog';
import { PROCEDURE_BRIEFS } from '@/data/procedureGuides';
import ProcedureGuideSections from '@/components/ProcedureGuideSections';

afterEach(cleanup);
describe('expanded procedure education', () => {
  it('provides distinct bilingual education for every catalog entry', () => {
    for (const p of PROCEDURE_CATALOG) {
      const guide = PROCEDURE_BRIEFS[p.slug];
      expect(guide, p.slug).toBeDefined();
      for (const text of [...guide.overview, ...guide.consideration]) expect(text.trim()).not.toBe('');
      expect(guide.overview[1]).toMatch(/[\u4e00-\u9fff]/);
    }
    expect(new Set(Object.values(PROCEDURE_BRIEFS).map(p => p.overview[0])).size).toBe(PROCEDURE_CATALOG.length);
  });
  it.each([false, true])('renders relevant content, sources and related internal links in zh=%s', zh => {
    render(<MemoryRouter><ProcedureGuideSections name="Brow Lift" category="Facial Rejuvenation" zh={zh} /></MemoryRouter>);
    expect(screen.getByTestId('procedure-expanded-guide')).toHaveTextContent(zh ? '眉提升调整' : 'A brow lift changes');
    expect(screen.getByRole('link', { name: 'ASPS · Brow lift risks' })).toHaveAttribute('href', 'https://www.plasticsurgery.org/cosmetic-procedures/brow-lift/safety');
    expect(screen.getByRole('link', { name: zh ? '面部拉皮' : 'Facelift' })).toHaveAttribute('href', '/treatments/facelift');
    expect(screen.getByText(zh ? '书面报价应包含什么？' : 'What should a written quote include?')).toBeInTheDocument();
  });
  it('distinguishes implants from veneers and RF needling from ordinary skin care', () => {
    expect(PROCEDURE_BRIEFS['dental-implants'].consideration[0]).toMatch(/fail/);
    expect(PROCEDURE_BRIEFS['porcelain-veneers'].consideration[0]).toMatch(/irreversible/);
    expect(PROCEDURE_BRIEFS['rf-microneedling'].consideration[0]).toMatch(/nerve injury/);
    expect(PROCEDURE_BRIEFS['dermal-fillers'].consideration[0]).toMatch(/blindness/);
  });
});
