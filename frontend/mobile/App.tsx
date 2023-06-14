import { Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { NativeRouter, Route, Routes } from "react-router-native";
import RelayEnvironment from "./relay/RelayEnvironment";
import ErrorBoundaryRetry from "./src/ErrorBoundaryRetry";

import PaymentMethod from "./src/PaymentMethod";
import PaymentCard from "./src/PaymentCard";
import PaymentPix from "./src/PaymentPix";

import LoadingSpinner from "./src/components/LoadingSpinner";

export default function App() {
  return (
    <RelayEnvironment>
      <ErrorBoundaryRetry>
        <NativeRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorBoundaryRetry>
              <Routes>
                <Route path="/" element={<PaymentMethod />} />
                <Route path="/paymentPix" element={<PaymentPix />} />
                <Route path="/paymentCard" element={<PaymentCard />} />
              </Routes>
            </ErrorBoundaryRetry>
          </Suspense>
        </NativeRouter>
      </ErrorBoundaryRetry>
      <StatusBar style="auto" />
    </RelayEnvironment>
  );
}
