import React from 'react';
import { InlineEligibilitySelectors, getAgeFromDOB, mapAgeToBucket, isAgeConsistentWithDOB } from '@/components/InlineEligibilitySelectors';

// Test component to showcase the InlineEligibilitySelectors
export const EligibilitySelectorDemo: React.FC = () => {
  const [ageBucket, setAgeBucket] = React.useState('');
  const [countryIso2, setCountryIso2] = React.useState('IT');
  const [isValid, setIsValid] = React.useState(false);
  
  // Sample DOB for testing
  const sampleDOB = '1990-05-15';
  
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Eligibility Selectors Demo</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sample DOB: {sampleDOB} (Age: {getAgeFromDOB(sampleDOB)})</h3>
            <p className="text-sm text-gray-600 mb-4">
              Suggested bucket: {mapAgeToBucket(getAgeFromDOB(sampleDOB))}
            </p>
          </div>
          
          <InlineEligibilitySelectors
            initialAgeBucket={ageBucket}
            initialCountryIso2={countryIso2}
            dob={sampleDOB}
            onAgeBucketChange={(bucket) => {
              setAgeBucket(bucket);
              console.log('Age bucket changed:', bucket);
              console.log('Is consistent with DOB:', isAgeConsistentWithDOB(bucket, sampleDOB));
            }}
            onCountryChange={(iso2) => {
              setCountryIso2(iso2);
              console.log('Country changed:', iso2);
            }}
            onValidationChange={(valid) => {
              setIsValid(valid);
              console.log('Validation changed:', valid);
            }}
          />
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Current State:</h4>
            <ul className="text-sm space-y-1">
              <li>Age Bucket: {ageBucket || 'Not selected'}</li>
              <li>Country: {countryIso2}</li>
              <li>Valid: {isValid ? '✅ Yes' : '❌ No'}</li>
              <li>Age consistent with DOB: {ageBucket ? (isAgeConsistentWithDOB(ageBucket, sampleDOB) ? '✅ Yes' : '❌ No') : 'N/A'}</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Helper Functions:</h4>
            <ul className="text-sm space-y-1">
              <li>getAgeFromDOB('1990-05-15'): {getAgeFromDOB('1990-05-15')}</li>
              <li>mapAgeToBucket(33): {mapAgeToBucket(33)}</li>
              <li>mapAgeToBucket(22): {mapAgeToBucket(22)}</li>
              <li>mapAgeToBucket(17): {mapAgeToBucket(17)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};