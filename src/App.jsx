import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";

const { Pages, Layout, mainPage } = pagesConfig;

const pageKeys = Object.keys(Pages || {});
const mainPageKey = mainPage ?? pageKeys[0];

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;

export default function App() {
  // Se por algum motivo não houver páginas configuradas, mostre um fallback
  if (!mainPageKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>pages.config não tem páginas configuradas.</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          {/* Redireciona / para a main page */}
          <Route path="/" element={<Navigate to={`/${mainPageKey.toLowerCase()}`} replace />} />

          {pageKeys.map((pageName) => {
            const PageComponent = Pages[pageName];
            return (
              <Route
                key={pageName}
                path={`/${pageName.toLowerCase()}`}
                element={
                  <LayoutWrapper currentPageName={pageName}>
                    <PageComponent />
                  </LayoutWrapper>
                }
              />
            );
          })}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <Toaster />
    </QueryClientProvider>
  );
}