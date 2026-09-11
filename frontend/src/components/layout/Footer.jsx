import React from 'react';
import { Link } from 'react-router-dom';
import { PivotVaultLogo } from '../../assets/logo';
import { NAV_CATEGORIES } from '../../lib/routes';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-[#EFEFEF] dark:border-[#202020] text-black dark:text-white transition-colors">
      {/* Top Editorial CTA / Newsletter Section */}
      <div className="border-b border-[#EFEFEF] dark:border-[#202020] py-14">
        <div className="site-container">
          <div className="max-w-2xl">
            <h3 className="text-[28px] md:text-[34px] font-extrabold leading-[38px] md:leading-[44px] tracking-tight">
              Learn from 413+ startup failures before you build.
            </h3>
            <p className="mt-3 text-[16px] text-[#555555] dark:text-white/60 leading-[24px]">
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
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap text-[15px] px-6"
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
            <p className="text-[14px] text-[#555555] dark:text-white/60 leading-[22px] max-w-sm">
              PivotVault is an independent Startup Intelligence Platform cataloging historical failure vectors, burn rates, and market collisions to help founders make resilient decisions.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="badge-neutral text-[11px] font-bold">
                413+ Documented Failures
              </span>
              <span className="badge-neutral text-[11px] font-bold">
                $26.8B+ Lost Capital Mapped
              </span>
            </div>
          </div>

          {/* Navigation Columns */}
          {NAV_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-3">
              <h4 className="text-[13px] font-extrabold uppercase tracking-wider text-black dark:text-white">
                {category.name}
              </h4>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-[14px] text-[#555555] dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
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
        <div className="mt-14 pt-8 border-t border-[#EFEFEF] dark:border-[#202020] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#555555] dark:text-white/50">
          <p>© {new Date().getFullYear()} PivotVault. All rights reserved. Bloomberg-style failure intelligence.</p>
          <div className="flex items-center gap-6">
            <Link to="/explore" className="hover:text-black dark:hover:text-white transition-colors">
              Platform Methodology
            </Link>
            <Link to="/explore" className="hover:text-black dark:hover:text-white transition-colors">
              Disclosures
            </Link>
            <Link to="/explore" className="hover:text-black dark:hover:text-white transition-colors">
              Legal & Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
