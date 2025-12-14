import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const TireEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('TireEdit component - ID:', id);
  }, [id]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Edit Tire</h1>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <p className='text-yellow-800'>
            This page is under construction. Tire Edit functionality will be implemented soon.
          </p>
          <button
            onClick={() => navigate('/tires')}
            className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Back to Tires
          </button>
        </div>
      </div>
    </div>
  );
};

export default TireEdit;
