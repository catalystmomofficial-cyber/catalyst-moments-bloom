import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { logNotFound } from "@/lib/notFoundLogger";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = location.pathname + location.search;
    console.error("404 Error: User attempted to access non-existent route:", fullPath);
    logNotFound(fullPath);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-6 break-all">
          {location.pathname}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          We've logged this so we can fix it. Try heading home.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
