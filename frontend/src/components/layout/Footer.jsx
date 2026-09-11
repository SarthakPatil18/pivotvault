import React from 'react';
import { Link } from 'react-router-dom';
import { PivotVaultLogo } from '../../assets/logo';
import { NAV_CATEGORIES } from '../../lib/routes';

export function Footer() {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#e3e8ee] text-[#273951] transition-colors">
      {/* Top Editorial CTA / Newsletter Section */}
      <div className="border-b border-[#e3e8ee] py-14">
        <div className="site-container">
          <div className="max-w-2xl">
            <h3 className="text-[28px] md:text-[34px] font-bold leading-[38px] md:leading-[44px] tracking-tight text-[#0d253d]">
              Learn from 413+ startup failures before you build.
            </h3>
            <p className="mt-3 text-[16px] text-[#64748d] leading-[24px]">
              Receive forensic failure breakdowns, post-mortem dissections, and risk models delivered weekly to your inbox.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to PivotVault Intelligence.');
              }}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Enter your work email..."
                className="input-editorial flex-1 text-[15px]"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #a8c3de',
                  borderRadius: '8px',
                  color: '#0d253d',
                  padding: '10px 14px'
                }}
              />
              <button
                type="submit"
                className="whitespace-nowrap text-[15px] px-6 transition-colors"
                style={{
                  backgroundColor: '#533afd',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4434d4'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#533afd'}
              >
                Join Archive
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Link Grid */}
      <div className="site-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <PivotVaultLogo />
            <p className="text-[14px] text-[#64748d] leading-[22px] max-w-sm">
              PivotVault is an independent Startup Intelligence Platform cataloging historical failure vectors, burn rates, and market collisions to help founders make resilient decisions.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="badge-neutral text-[11px] font-medium">
                413+ Documented Failures
              </span>
              <span className="badge-neutral text-[11px] font-medium">
                $26.8B+ Lost Capital Mapped
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          {NAV_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0d253d]">
                {category.name}
              </h4>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-[14px] text-[#64748d] hover:text-[#0d253d] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Disclosures & Copyright */}
        <div className="mt-14 pt-8 border-t border-[#e3e8ee] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#64748d]">
          <p>© {new Date().getFullYear()} PivotVault. All rights reserved. Bloomberg-style failure intelligence.</p>
          <div className="flex items-center gap-6">
            <Link to="/explore" className="hover:text-[#0d253d] transition-colors">
              Platform Methodology
            </Link>
            <Link to="/explore" className="hover:text-[#0d253d] transition-colors">
              Disclosures
            </Link>
            <Link to="/explore" className="hover:text-[#0d253d] transition-colors">
              Legal & Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
