import { FC } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
interface LayOutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
  headerMiddleContent?: React.ReactNode;
}
const Layout: FC<LayOutProps> = ({
  children,
  className,
  showFooter = true,
  headerMiddleContent,
}) => {
  return (
    <>
      <Navbar middleContent={headerMiddleContent} />
      <main className={`${className ?? ''} tw-mx-2`}>{children}</main>
      {showFooter && <Footer />}
    </>
  );
};
export default Layout;
