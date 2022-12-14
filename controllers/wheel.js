const Wheel = require('../models/wheel');
const User = require('../models/user');
const Reservation = require('../models/reservation');

module.exports.goToShow = async (req, res) => {
  req.session.returnTo = req.originalUrl;
  const { id } = req.params;
  const wheel = await Wheel.findById(id);
  const { originalUrl } = req;
  res.render('wheels/detail', { wheel, originalUrl });
}

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const redirectUrl = req.originalUrl.replace('?_method=PUT', '');
  const wheel = await Wheel.findByIdAndUpdate(id, { ...req.body.wheel });
  wheel.image = req.file.path;
  await wheel.save();
  req.flash('success', '편집 완료!');
  res.redirect(redirectUrl);
}

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const { originalUrl } = req;
  const redirectUrl = originalUrl.replace(`/${id}?_method=DELETE`, '');
  await Wheel.findByIdAndDelete(id);
  req.flash('success', '삭제 완료!');
  res.redirect(redirectUrl);
}

module.exports.goToEdit = async (req, res) => {
  const { id } = req.params;
  const wheel = await Wheel.findById(id);
  const originalUrl = req.originalUrl.replace('/edit', '');
  res.render('wheels/edit', { wheel, originalUrl });
}

module.exports.goToReserve = async (req, res) => {
  const { id } = req.params;
  const wheel = await Wheel.findById(id);
  res.render("reservation/form", { wheel });
}

module.exports.reserve = async (req, res, next) => {
  const { id } = req.params;
  const wheel = await Wheel.findById(id);
  const { user } = req;
  const reservation = new Reservation(req.body.reservation);
  wheel.reservations.push(reservation);
  user.reservations.push(reservation);
  await wheel.save();
  await user.save();
  await reservation.save();
  req.flash('success', '예약 완료!');
  const { originalUrl } = req;
  const redirectUrl = originalUrl.replace('/reserve', '');
  res.redirect(redirectUrl);
}


