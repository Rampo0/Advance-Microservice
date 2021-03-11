import express from 'express';

const router = express.Router();

router.get('/api/users/liveness-readiness', (req, res) => {
    res.status(200).send({ message : 'success'});
});

export { router as livenessReadinessRouter };