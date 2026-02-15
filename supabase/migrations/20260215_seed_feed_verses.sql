-- ============================================
-- MIGRATION: Seed Feed Verses
-- Generated: 2026-02-15
-- Daily verses: 365
-- Mood verses: 297
-- ============================================

BEGIN;

-- ============================================
-- PART 1: 365 Daily Verses
-- ============================================

-- Temp table to track daily verse card IDs for linking
CREATE TEMP TABLE _daily_verse_ids (day_number INT, card_id UUID);

-- Daily verses batch 1
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 1 Verse', 'Genesis 1:1', '{"verse_text":"In the beginning God created the heaven and the earth.","verse_reference":"Genesis 1:1","short_text":"In the beginning God created the heaven and the earth.","devotional":"Before anything was, God spoke — and emptiness became beauty. Every sunrise still carries the echo of that first word. You are not random; you live in a world shaped by deliberate love.","prayer":"Heavenly Father, thank You for the gift of creation. Open my eyes to marvel at Your work and steward this earth with gratitude. Amen.","note":"Everything beautiful begins with God’s voice — including your day.","day_number":1}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 1, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 2 Verse', 'Psalm 23:1', '{"verse_text":"The LORD is my shepherd; I shall not want.","verse_reference":"Psalm 23:1","short_text":"The LORD is my shepherd; I shall not want.","devotional":"A shepherd knows every sheep by name, leads gently, and never leaves. In a world that rushes and demands, you have a Guide who provides before you even know your need.","prayer":"Lord, thank You for being my Shepherd. Help me trust Your guidance and rest in Your provision, knowing I lack nothing in You. Amen.","note":"The Shepherd never sleeps; you can.","day_number":2}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 2, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 3 Verse', 'Matthew 5:5', '{"verse_text":"Blessed are the meek: for they shall inherit the earth.","verse_reference":"Matthew 5:5","short_text":"Blessed are the meek: for they shall inherit the earth.","devotional":"Meekness isn’t weakness — it’s strength held gently, trusting God’s timing. The world rewards the loud, but heaven promises the earth to those who wait in quiet faith.","prayer":"God, soften my heart with true meekness. Help me trust Your promises and look forward to the inheritance ahead. Amen.","note":"Gentle hearts will hold the future.","day_number":3}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 3, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 4 Verse', 'Philippians 4:13', '{"verse_text":"I can do all things through Christ which strengtheneth me.","verse_reference":"Philippians 4:13","short_text":"I can do all things through Christ which strengtheneth me.","devotional":"Written not from a place of triumph, but from chains. Real strength isn’t self-made — it flows when we admit we need Him most. Today’s “all things” are covered.","prayer":"Dear Lord, I draw strength from Christ alone. Carry me through everything You place before me today. Amen.","note":"Your weakness is where His power begins.","day_number":4}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 4, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 5 Verse', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.","verse_reference":"Isaiah 40:31","short_text":"But they that wait upon the LORD shall renew their strength...","devotional":"Waiting feels like wasting, but it’s where wings grow. God doesn’t just patch tired hearts — He exchanges exhaustion for energy that doesn’t fade.","prayer":"Father, teach me to wait on You patiently. Renew my strength so I can rise, run, and walk without fainting. Amen.","note":"Wings come to those who rest in Him.","day_number":5}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 5, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 6 Verse', 'Jeremiah 29:11', '{"verse_text":"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.","verse_reference":"Jeremiah 29:11","short_text":"For I know the thoughts that I think toward you, saith the LORD...","devotional":"Spoken to exiles far from home. Your story isn’t ending in chaos — God already sees the peace waiting at the finish line. His thoughts toward you are kind.","prayer":"Thank You, Lord, for Your thoughts of peace toward me. Help me trust the good future and hope You have planned. Amen.","note":"God’s mind toward you has never held harm.","day_number":6}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 6, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 7 Verse', 'Proverbs 3:5', '{"verse_text":"Trust in the LORD with all thine heart; and lean not unto thine own understanding.","verse_reference":"Proverbs 3:5","short_text":"Trust in the LORD with all thine heart...","devotional":"Your understanding has limits; His doesn’t. Leaning on your own insight feels safe — until the road curves. Trust is surrendering the map to the One who drew it.","prayer":"Lord, help me trust You with my whole heart and stop leaning on my limited understanding. Amen.","note":"The wisest move is to let Him lead.","day_number":7}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 7, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 8 Verse', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy isn’t the absence of sorrow — it’s the presence of God in it. His joy doesn’t depend on circumstances; it carries you through them.","prayer":"God, let Your joy rise in me today and become the strength I need to face whatever comes. Amen.","note":"Joy in Him outlasts every storm.","day_number":8}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 8, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 9 Verse', 'Psalm 56:3', '{"verse_text":"What time I am afraid, I will trust in thee.","verse_reference":"Psalm 56:3","short_text":"What time I am afraid, I will trust in thee.","devotional":"Fear knocks loudly, but trust answers louder. In the exact moment anxiety rises, you can choose to turn your eyes to the One who never trembles.","prayer":"When fear comes, Lord, remind me to place my trust in You completely. Amen.","note":"Fear visits; trust decides whether it stays.","day_number":9}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 9, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 10 Verse', 'Romans 8:28', '{"verse_text":"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.","verse_reference":"Romans 8:28","short_text":"And we know that all things work together for good...","devotional":"Not all things are good, but God weaves them toward good for those who love Him. Even the threads that hurt are held in sovereign hands.","prayer":"Thank You, God, that all things work together for good. Open my eyes to see Your hand in every part of my story. Amen.","note":"Nothing is wasted in the hands of God.","day_number":10}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 10, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 11 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"Trouble will come, but so does a fortress. God doesn’t just watch from afar — He is the safe place you run into when the storm hits.","prayer":"Lord, You are good and my stronghold. Help me run to You and know You deeply in every trouble. Amen.","note":"The storm reveals the strength of your refuge.","day_number":11}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 11, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 12 Verse', 'Joshua 1:9', '{"verse_text":"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Be strong and of a good courage...","devotional":"Courage isn’t the absence of fear — it’s the presence of God. Wherever you step today, He has already gone ahead.","prayer":"God, make me strong and courageous, knowing You are with me wherever I go. Amen.","note":"You are never walking alone.","day_number":12}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 12, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 13 Verse', 'Psalm 119:105', '{"verse_text":"Thy word is a lamp unto my feet, and a light unto my path.","verse_reference":"Psalm 119:105","short_text":"Thy word is a lamp unto my feet...","devotional":"Not a floodlight for the whole journey, but a lamp for the next step. God’s Word gives just enough light to keep walking in the dark.","prayer":"May Your word be a lamp to my feet and a light to my path, guiding me faithfully today. Amen.","note":"One step at a time is enough when He lights it.","day_number":13}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 13, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 14 Verse', 'Deuteronomy 31:6', '{"verse_text":"Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.","verse_reference":"Deuteronomy 31:6","short_text":"Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee...","devotional":"Facing unknown territories, God''s command rings true — be strong, fear not, for He goes with you. He will not fail or forsake; your journey is guarded by His faithful presence.","prayer":"Lord, strengthen me with courage, knowing You are with me and will never leave or forsake me. Amen.","note":"He never fails those He accompanies.","day_number":14}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 14, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 15 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"He doesn’t just give strength — He is your strength. He doesn’t just provide protection — He stands as your shield.","prayer":"Lord, You are my strength and shield. My heart trusts in You, and I am helped. Let my soul rejoice. Amen.","note":"Trust turns the shield into song.","day_number":15}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 15, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 16 Verse', 'Psalm 31:24', '{"verse_text":"Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.","verse_reference":"Psalm 31:24","short_text":"Be of good courage, and he shall strengthen your heart...","devotional":"Hope in the Lord fuels courage — He strengthens the heart that waits on Him, turning weakness into steady faith.","prayer":"Lord, help me hope in You and receive the strength for my heart. Amen.","note":"Hope strengthens the heart.","day_number":16}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 16, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 17 Verse', '2 Corinthians 1:3-4', '{"verse_text":"Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation, that we may be able to comfort them which are in any trouble, by the comfort wherewith we ourselves are comforted of God.","verse_reference":"2 Corinthians 1:3-4","short_text":"Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort...","devotional":"The God of all comfort meets us in tribulation — not to remove it always, but to equip us to comfort others. His mercy turns our pain into purpose.","prayer":"Blessed Father, comfort me in my troubles so I can comfort others with the same comfort You give. Amen.","note":"Comfort received is comfort to give.","day_number":17}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 17, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 18 Verse', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him; for he careth for you.","devotional":"You weren’t designed to carry the weight alone. Every worry is an invitation to hand it over to the One whose heart is already moved for you.","prayer":"Father, I cast every care on You today, trusting that You care for me more than I know. Amen.","note":"He cares before you cast.","day_number":18}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 18, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 19 Verse', '1 Thessalonians 5:11', '{"verse_text":"Wherefore comfort yourselves together, and edify one another, even as also ye do.","verse_reference":"1 Thessalonians 5:11","short_text":"Wherefore comfort yourselves together, and edify one another...","devotional":"Community is God''s gift for encouragement — comfort one another, build each other up. In togetherness, strength multiplies and burdens lighten.","prayer":"Lord, help me comfort and edify others, as we build one another in faith. Amen.","note":"Together, we build strength.","day_number":19}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 19, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 20 Verse', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour and are heavy laden...","devotional":"Jesus doesn’t say “fix yourself first.” He says come — tired, burdened, just as you are — and find rest that reaches the soul.","prayer":"Jesus, I come to You now with all my weariness. Thank You for the rest only You can give. Amen.","note":"Rest begins with surrender.","day_number":20}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 20, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 21 Verse', 'Numbers 6:24', '{"verse_text":"The LORD bless thee, and keep thee:","verse_reference":"Numbers 6:24","short_text":"The LORD bless thee, and keep thee...","devotional":"An ancient blessing still spoken over you today: kept safe, watched over, face-to-face with grace and peace.","prayer":"Lord, bless and keep me. Make Your face shine upon me and grant me Your perfect peace. Amen.","note":"His face toward you is your peace.","day_number":21}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 21, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 22 Verse', 'Isaiah 12:2', '{"verse_text":"Behold, God is my salvation; I will trust, and not be afraid: for the LORD JEHOVAH is my strength and my song; he also is become my salvation.","verse_reference":"Isaiah 12:2","short_text":"Behold, God is my salvation; I will trust, and not be afraid...","devotional":"God is not just savior — He is your strength and song. Trust replaces fear when He becomes the melody of your life.","prayer":"Lord, You are my salvation, strength, and song — help me trust and not fear. Amen.","note":"Trust turns fear into song.","day_number":22}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 22, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 23 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"Not distant, not delayed — a very present help. When everything shakes, He remains the steady place you hide and draw strength from.","prayer":"God, You are my refuge and strength, always present in trouble. Thank You for never leaving me. Amen.","note":"He is closer than the trouble.","day_number":23}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 23, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 24 Verse', 'Psalm 37:4', '{"verse_text":"Delight thyself also in the LORD; and he shall give thee the desires of thine heart.","verse_reference":"Psalm 37:4","short_text":"Delight thyself also in the LORD...","devotional":"When God becomes your deepest delight, your desires begin to mirror His. He doesn’t just give what you want — He shapes what you want.","prayer":"Lord, teach me to delight in You above all else, trusting You with the desires of my heart. Amen.","note":"Delight changes what you desire.","day_number":24}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 24, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 25 Verse', 'John 14:27', '{"verse_text":"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","verse_reference":"John 14:27","short_text":"Peace I leave with you, my peace I give unto you...","devotional":"Not the fragile peace the world offers, but Christ’s own — unshaken by circumstances, deep enough to calm every storm inside.","prayer":"Jesus, thank You for Your gift of peace. Guard my heart from trouble and fear today. Amen.","note":"His peace guards what the world cannot touch.","day_number":25}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 25, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 26 Verse', '1 Corinthians 16:14', '{"verse_text":"Let all your things be done with charity.","verse_reference":"1 Corinthians 16:14","short_text":"Let all your things be done with charity.","devotional":"Love isn’t just something you feel — it’s the way you do everything. Even the smallest task becomes sacred when wrapped in charity.","prayer":"Lord, let everything I do today flow from genuine love. Amen.","note":"Love is the manner of every moment.","day_number":26}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 26, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 27 Verse', 'Psalm 46:10', '{"verse_text":"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.","verse_reference":"Psalm 46:10","short_text":"Be still, and know that I am God...","devotional":"In the rush and noise, stillness is an act of faith. Quieting your soul declares: He is God, and that is enough.","prayer":"Lord, quiet my heart today. Help me be still and know that You are God. Amen.","note":"Stillness is worship.","day_number":27}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 27, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 28 Verse', 'Philippians 4:4', '{"verse_text":"Rejoice in the Lord always: and again I say, Rejoice.","verse_reference":"Philippians 4:4","short_text":"Rejoice in the Lord always: and again I say, Rejoice.","devotional":"Joy in the Lord isn’t a suggestion — it’s a command you can obey because He never changes. Rejoice, and again — rejoice.","prayer":"Lord, fill me with joy in You today and help me choose rejoicing no matter what comes. Amen.","note":"Rejoicing is repeated because it’s possible.","day_number":28}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 28, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 29 Verse', 'James 1:12', '{"verse_text":"Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.","verse_reference":"James 1:12","short_text":"Blessed is the man that endureth temptation...","devotional":"Endurance isn’t glamorous, but it leads to a crown. God never wastes a trial — every temptation overcome shapes you for glory.","prayer":"God, strengthen me to endure temptation faithfully, keeping my eyes on the crown of life You promise. Amen.","note":"Every resisted temptation is a step toward the crown.","day_number":29}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 29, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 30 Verse', 'Psalm 121:1', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.","verse_reference":"Psalm 121:1","short_text":"I will lift up mine eyes unto the hills, from whence cometh my help...","devotional":"Help doesn’t come from the hills — it comes from the One who made them. Lift your eyes higher, and find strength waiting.","prayer":"Lord, my help comes from You, the maker of heaven and earth. I lift my eyes to You today. Amen.","note":"Look past the mountains to the Maker.","day_number":30}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 30, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 31 Verse', 'Habakkuk 3:19', '{"verse_text":"The LORD God is my strength, and he will make my feet like hinds'' feet, and he will make me to walk upon mine high places. To the chief singer on my stringed instruments.","verse_reference":"Habakkuk 3:19","short_text":"The LORD God is my strength, and he will make my feet like hinds'' feet...","devotional":"In the midst of uncertainty, God gives strength for the heights — He makes your steps sure, like a deer on rocky paths, leading to victory''s song.","prayer":"Lord, be my strength and make my feet like hinds'' feet to walk in high places. Amen.","note":"Strength for the heights.","day_number":31}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 31, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 32 Verse', 'Ephesians 6:10', '{"verse_text":"Finally, my brethren, be strong in the Lord, and in the power of his might.","verse_reference":"Ephesians 6:10","short_text":"Finally, my brethren, be strong in the Lord...","devotional":"True strength is not your own — it''s in the Lord, in His mighty power. Arm yourself with Him for every battle ahead.","prayer":"Lord, help me be strong in You and in the power of Your might. Amen.","note":"His might is your strength.","day_number":32}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 32, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 33 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus sees the tears others overlook and calls them blessed. Mourning opens the heart to the comfort only He can give.","prayer":"Lord, meet me in my sorrow today and wrap me in the comfort You promise. Amen.","note":"Tears in His hands become comfort.","day_number":33}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 33, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 34 Verse', 'Psalm 18:2', '{"verse_text":"The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower.","verse_reference":"Psalm 18:2","short_text":"The LORD is my rock, and my fortress, and my deliverer...","devotional":"When everything shifts, He remains unmoved—solid ground beneath, strong walls around, and a rescuer who never fails to arrive.","prayer":"Lord, You are my rock, fortress, and deliverer. I take refuge in You today. Amen.","note":"Unshakable refuge for a shaking world.","day_number":34}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 34, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 35 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Keeping Him in view changes everything. With the Lord always before me, fear loses its grip and stability finds its root.","prayer":"Lord, help me set You always before my eyes so I will not be shaken, no matter what comes. Amen.","note":"Eyes fixed on Him keep the heart steady.","day_number":35}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 35, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 36 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"One name holds more safety than any fortress built by hands. The righteous run to it—and find themselves lifted above the storm.","prayer":"Lord, at the sound of Your name I run to You. Keep me safe in the shelter it provides. Amen.","note":"His name is the safest place to run.","day_number":36}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 36, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 37 Verse', 'Luke 1:37', '{"verse_text":"For with God nothing shall be impossible.","verse_reference":"Luke 1:37","short_text":"For with God nothing shall be impossible.","devotional":"The angel’s words still echo: no promise from God is too hard, no situation too far gone. Impossibility bows before His power.","prayer":"God, remind me today that nothing is impossible with You. Grow my faith in Your limitless power. Amen.","note":"Impossible is where God starts.","day_number":37}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 37, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 38 Verse', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD: be of good courage...","devotional":"Waiting is not wasting when it’s on the Lord. Courage grows in the quiet space between promise and fulfillment.","prayer":"Lord, give me courage to wait on You patiently, trusting You will strengthen my heart. Amen.","note":"Waiting on Him builds quiet courage.","day_number":38}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 38, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 39 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus sees the tears others overlook and calls them blessed. Mourning opens the heart to the comfort only He can give.","prayer":"Lord, meet me in my sorrow today and wrap me in the comfort You promise. Amen.","note":"Tears in His hands become comfort.","day_number":39}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 39, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 40 Verse', 'Psalm 51:10', '{"verse_text":"Create in me a clean heart, O God; and renew a right spirit within me.","verse_reference":"Psalm 51:10","short_text":"Create in me a clean heart, O God...","devotional":"Honest confession invites divine renewal. He doesn’t patch old hearts—He creates clean ones, fresh and ready.","prayer":"God, create in me a clean heart and renew a right spirit within me today. Amen.","note":"New hearts begin with honest prayer.","day_number":40}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 40, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 41 Verse', 'Psalm 9:10', '{"verse_text":"And they that know thy name will put their trust in thee: for thou, LORD, hast not forsaken them that seek thee.","verse_reference":"Psalm 9:10","short_text":"And they that know thy name will put their trust in thee...","devotional":"Knowing His name invites trust — He never forsakes those who seek Him. Your pursuit is met with His faithful presence.","prayer":"Lord, I trust in You because I know Your name; thank You for not forsaking me as I seek You. Amen.","note":"Knowing Him breeds trust.","day_number":41}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 41, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 42 Verse', 'Psalm 37:5', '{"verse_text":"Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.","verse_reference":"Psalm 37:5","short_text":"Commit thy way unto the LORD; trust also in him...","devotional":"Commit your path to Him and trust — He will bring it to pass. Surrender opens the door to His faithful action.","prayer":"Lord, I commit my way to You and trust You to bring it to pass. Amen.","note":"Commit and He completes.","day_number":42}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 42, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 43 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace doesn’t remove weakness—it inhabits it. His power shines brightest where we end.","prayer":"Lord, let Your grace be enough today. Show Your strength in my weakness. Amen.","note":"Grace turns weakness into glory.","day_number":43}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 43, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 44 Verse', 'Isaiah 26:4', '{"verse_text":"Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.","verse_reference":"Isaiah 26:4","short_text":"Trust ye in the LORD for ever...","devotional":"Everlasting strength belongs to an everlasting God. Trust placed in Him never expires.","prayer":"Lord, I trust in You forever—for in You is everlasting strength. Amen.","note":"Forever trust deserves forever strength.","day_number":44}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 44, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 45 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not from Him. He gives power to stand, love to reach out, and a sound mind to think clearly.","prayer":"Thank You, God, for the spirit of power, love, and a sound mind. Drive out fear today. Amen.","note":"Fear flees where His Spirit lives.","day_number":45}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 45, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 46 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD shall fight for you...","devotional":"Sometimes the greatest act of faith is silence—standing still while God moves on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":46}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 46, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 47 Verse', 'Isaiah 40:29', '{"verse_text":"He giveth power to the faint; and to them that have no might he increaseth strength.","verse_reference":"Isaiah 40:29","short_text":"He giveth power to the faint...","devotional":"When strength runs dry, He doesn’t scold—He supplies. Fresh power for weary hearts.","prayer":"Lord, give power to my faint heart and increase strength where I have none. Amen.","note":"He specialises in weary souls.","day_number":47}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 47, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 48 Verse', 'Psalm 56:11', '{"verse_text":"In God have I put my trust: I will not be afraid what man can do unto me.","verse_reference":"Psalm 56:11","short_text":"In God I have put my trust...","devotional":"Trust placed in God silences fear of man. What can flesh do when the Almighty stands with you?","prayer":"In You I trust, God—I will not fear what man can do to me. Amen.","note":"Trust in Him drowns out fear of them.","day_number":48}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 48, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 49 Verse', 'Psalm 68:19', '{"verse_text":"Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation. Selah.","verse_reference":"Psalm 68:19","short_text":"Blessed be the Lord, who daily loadeth us with benefits...","devotional":"Every morning brings fresh mercy. He doesn’t ration blessings—He loads us daily.","prayer":"Blessed be You, Lord, who daily loads us with benefits. Thank You. Amen.","note":"Daily bread, daily benefits.","day_number":49}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 49, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 50 Verse', 'John 14:1', '{"verse_text":"Let not your heart be troubled: ye believe in God, believe also in me.","verse_reference":"John 14:1","short_text":"Let not your heart be troubled...","devotional":"Jesus speaks peace into anxious hearts. Belief in Him is the antidote to trouble.","prayer":"Lord, calm my troubled heart today as I believe in You. Amen.","note":"Belief quiets the heart.","day_number":50}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 50, id FROM ins;

-- Daily verses batch 2
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 51 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation; whom shall I fear?","devotional":"Light scatters darkness, salvation removes fear. With Him as both, fear has no foothold.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation leave no room for fear.","day_number":51}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 51, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 52 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"He invites every heavy load. Casting isn’t once—it’s a daily release into sustaining hands.","prayer":"I cast my burdens on You, Lord—sustain me today. Amen.","note":"He never staggers under the weight.","day_number":52}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 52, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 53 Verse', 'Psalm 111:4', '{"verse_text":"He hath made his wonderful works to be remembered: the LORD is gracious and full of compassion.","verse_reference":"Psalm 111:4","short_text":"The LORD is gracious, and full of compassion...","devotional":"His nature is grace upon grace, compassion without limit. Every memory of His works reminds us.","prayer":"Lord, You are gracious and full of compassion—thank You for Your heart toward me. Amen.","note":"Grace and compassion define Him.","day_number":53}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 53, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 54 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"No cry from His own goes unheard. He listens, then moves—delivering from every trouble.","prayer":"Lord, hear my cry today and deliver me from all my troubles. Amen.","note":"He never misses a righteous cry.","day_number":54}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 54, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 55 Verse', 'Mark 11:24', '{"verse_text":"Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.","verse_reference":"Mark 11:24","short_text":"What things soever ye desire, when ye pray, believe...","devotional":"Prayer paired with belief moves mountains. Faith receives before it sees.","prayer":"Lord, help me pray with believing faith that receives what I ask. Amen.","note":"Believe and you will receive.","day_number":55}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 55, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 56 Verse', 'Hebrews 12:1', '{"verse_text":"Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.","verse_reference":"Hebrews 12:1","short_text":"Let us run with patience the race that is set before us...","devotional":"The Christian life is a marathon, not a sprint. Patience keeps the pace steady toward the finish.","prayer":"Lord, help me run with patient endurance the race You’ve set before me. Amen.","note":"Patience wins the long race.","day_number":56}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 56, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 57 Verse', 'Philippians 4:6', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.","verse_reference":"Philippians 4:6","short_text":"Be careful for nothing; but in every thing by prayer...","devotional":"Anxiety is replaced by prayer, thanksgiving, and known requests. Peace guards the heart that prays.","prayer":"Lord, I bring everything to You in prayer with thanksgiving—replace my anxiety with Your peace. Amen.","note":"Prayer trades worry for peace.","day_number":57}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 57, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 58 Verse', 'Psalm 91:1', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.","verse_reference":"Psalm 91:1","short_text":"He that dwelleth in the secret place of the most High...","devotional":"Dwelling in His secret place lifts us under His shadow—safe, hidden, protected.","prayer":"Lord, help me dwell in Your secret place and rest under Your shadow. Amen.","note":"The secret place is the safest place.","day_number":58}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 58, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 59 Verse', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace belongs to the mind stayed on Him. Focus determines calm.","prayer":"Lord, keep my mind stayed on You so I may live in perfect peace. Amen.","note":"Stayed minds receive perfect peace.","day_number":59}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 59, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 60 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust rooted in Him brings blessing that circumstances cannot touch. The tree by water never fears drought.","prayer":"Lord, bless me as I place my full trust in You alone. Amen.","note":"Trust in Him brings unshakable blessing.","day_number":60}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 60, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 61 Verse', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"His presence is the end of fear. Strength, help, and upholding come from the same voice.","prayer":"Lord, I will not fear—for You are with me, strengthening and upholding me. Amen.","note":"His ‘with you’ silences fear.","day_number":61}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 61, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 62 Verse', 'Proverbs 16:3', '{"verse_text":"Commit thy works unto the LORD, and thy thoughts shall be established.","verse_reference":"Proverbs 16:3","short_text":"Commit thy works unto the LORD...","devotional":"Handing every plan to Him aligns thoughts and outcomes. Commitment brings establishment.","prayer":"Lord, I commit all my works to You—establish my thoughts today. Amen.","note":"Committed plans find firm footing.","day_number":62}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 62, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 63 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"Distance is illusion—He is near to every sincere call. No prayer travels far.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is closer than your next breath.","day_number":63}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 63, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 64 Verse', 'Exodus 33:14', '{"verse_text":"And he said, My presence shall go with thee, and I will give thee rest.","verse_reference":"Exodus 33:14","short_text":"My presence shall go with thee, and I will give thee rest.","devotional":"His presence is the promise—and rest is the gift. Where He goes, peace follows.","prayer":"Lord, let Your presence go with me today and grant me Your rest. Amen.","note":"Presence brings perfect rest.","day_number":64}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 64, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 65 Verse', '1 Peter 1:3', '{"verse_text":"Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.","verse_reference":"1 Peter 1:3","short_text":"Blessed be the God and Father of our Lord Jesus Christ...","devotional":"Every blessing flows from the Father through the Son. Praise rises naturally.","prayer":"Blessed be You, God and Father of our Lord Jesus Christ. Amen.","note":"All blessing begins with Him.","day_number":65}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 65, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 66 Verse', 'Psalm 29:11', '{"verse_text":"The LORD will give strength unto his people; the LORD will bless his people with peace.","verse_reference":"Psalm 29:11","short_text":"The LORD will give strength unto his people...","devotional":"His strength is not distant—He gives it directly to His own. Peace follows the gift.","prayer":"Lord, give me strength today and bless me with Your peace. Amen.","note":"Strength and peace are His gifts.","day_number":66}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 66, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 67 Verse', 'Psalm 34:8', '{"verse_text":"O taste and see that the LORD is good: blessed is the man that trusteth in him.","verse_reference":"Psalm 34:8","short_text":"O taste and see that the LORD is good...","devotional":"Experience Him for yourself—taste His goodness. Those who trust find refuge and blessing.","prayer":"Lord, let me taste and see Your goodness today. Amen.","note":"Taste leads to trust.","day_number":67}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 67, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 68 Verse', 'Psalm 103:8', '{"verse_text":"The LORD is merciful and gracious, slow to anger, and plenteous in mercy.","verse_reference":"Psalm 103:8","short_text":"The LORD is merciful and gracious...","devotional":"His mercy is slow to anger, abounding in steadfast love. He remembers we are dust.","prayer":"Lord, thank You for Your mercy and grace toward me. Amen.","note":"Mercy remembers our frailty.","day_number":68}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 68, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 69 Verse', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God binds up what is shattered. His healing reaches the deepest wounds.","prayer":"Lord, heal my broken heart and bind up my wounds today. Amen.","note":"He mends what is torn.","day_number":69}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 69, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 70 Verse', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded, that neither death, nor life...","devotional":"Nothing in all creation can break the bond of His love. We are held forever.","prayer":"Lord, thank You that nothing can separate me from Your love in Christ Jesus. Amen.","note":"His love holds when everything else fails.","day_number":70}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 70, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 71 Verse', 'Lamentations 3:25', '{"verse_text":"The LORD is good unto them that wait for him, to the soul that seeketh him.","verse_reference":"Lamentations 3:25","short_text":"The LORD is good unto them that wait for him...","devotional":"Waiting on Him is never wasted. His goodness meets those who seek Him quietly.","prayer":"Lord, I wait for You—show me Your goodness today. Amen.","note":"Goodness comes to waiters.","day_number":71}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 71, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 72 Verse', 'Psalm 34:19', '{"verse_text":"Many are the afflictions of the righteous: but the LORD delivereth him out of them all.","verse_reference":"Psalm 34:19","short_text":"Many are the afflictions of the righteous...","devotional":"Trouble comes, but deliverance is certain. God rescues completely.","prayer":"Lord, deliver me from all my afflictions today. Amen.","note":"Deliverance follows every trial.","day_number":72}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 72, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 73 Verse', 'Psalm 119:57', '{"verse_text":"Thou art my portion, O LORD: I have said that I would keep thy words.","verse_reference":"Psalm 119:57","short_text":"The LORD is my portion...","devotional":"When everything else fades, He remains your inheritance. Choose Him, and find sufficiency.","prayer":"Lord, You are my portion—I have chosen to keep Your words. Amen.","note":"He is enough.","day_number":73}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 73, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 74 Verse', 'Jeremiah 33:3', '{"verse_text":"Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.","verse_reference":"Jeremiah 33:3","short_text":"Call unto me, and I will answer thee...","devotional":"He invites you to ask great things. Prayer opens doors to things you cannot yet see.","prayer":"Lord, I call to You—show me great and mighty things. Amen.","note":"Call and He answers.","day_number":74}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 74, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 75 Verse', 'Zephaniah 3:17', '{"verse_text":"The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.","verse_reference":"Zephaniah 3:17","short_text":"The LORD thy God in the midst of thee is mighty...","devotional":"He is not distant—He is in your midst, rejoicing over you with singing. His love quiets fear.","prayer":"Lord, quiet me with Your love today. Amen.","note":"He sings over you.","day_number":75}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 75, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 76 Verse', 'Hebrews 13:5', '{"verse_text":"...for he hath said, I will never leave thee, nor forsake thee.","verse_reference":"Hebrews 13:5","short_text":"I will never leave thee, nor forsake thee.","devotional":"His promise stands eternal—no circumstance can change His nearness.","prayer":"Lord, thank You that You will never leave or forsake me. Amen.","note":"Never alone.","day_number":76}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 76, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 77 Verse', 'Hebrews 13:6', '{"verse_text":"So that we may boldly say, The Lord is my helper, and I will not fear what man shall do unto me.","verse_reference":"Hebrews 13:6","short_text":"The LORD is my helper...","devotional":"With Him as helper, fear has no power. What can man do?","prayer":"Lord, You are my helper—I will not fear what man shall do unto me. Amen.","note":"Helper stronger than any threat.","day_number":77}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 77, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 78 Verse', 'Psalm 27:10', '{"verse_text":"When my father and my mother forsake me, then the LORD will take me up.","verse_reference":"Psalm 27:10","short_text":"When my father and my mother forsake me...","devotional":"Even when human love fails, God takes you up. His care never wavers.","prayer":"Lord, when others fail, take me up. Amen.","note":"He takes us up.","day_number":78}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 78, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 79 Verse', 'Deuteronomy 33:27', '{"verse_text":"The eternal God is thy refuge, and underneath are the everlasting arms...","verse_reference":"Deuteronomy 33:27","short_text":"The eternal God is thy refuge...","devotional":"Underneath are everlasting arms—eternal refuge, eternal strength.","prayer":"Lord, You are my eternal refuge—hold me in Your everlasting arms. Amen.","note":"Everlasting arms beneath.","day_number":79}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 79, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 80 Verse', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.","verse_reference":"Psalm 16:11","short_text":"Thou wilt shew me the path of life...","devotional":"In His presence is fullness of joy. He guides to the path that leads to life.","prayer":"Lord, show me the path of life and fill me with joy in Your presence. Amen.","note":"Fullness of joy in His presence.","day_number":80}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 80, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 81 Verse', 'Psalm 145:20', '{"verse_text":"The LORD preserveth all them that love him: but all the wicked will he destroy.","verse_reference":"Psalm 145:20","short_text":"The LORD preserveth all them that love him...","devotional":"He watches over those who love Him. Preservation is His faithful response.","prayer":"Lord, preserve me because I love You. Amen.","note":"Love invites preservation.","day_number":81}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 81, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 82 Verse', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace, and sleep...","devotional":"Peace from Him allows rest even in turmoil. He makes sleep safe.","prayer":"Lord, let me lie down in peace and sleep, for You alone make me dwell in safety. Amen.","note":"Peace brings safe sleep.","day_number":82}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 82, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 83 Verse', 'Exodus 15:2', '{"verse_text":"The LORD is my strength and song, and he is become my salvation...","verse_reference":"Exodus 15:2","short_text":"The LORD is my strength and song...","devotional":"He becomes both power and melody. Victory is sung because of Him.","prayer":"Lord, You are my strength and song—You have become my salvation. Amen.","note":"Strength turns into song.","day_number":83}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 83, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 84 Verse', 'Deuteronomy 33:25', '{"verse_text":"...and as thy days, so shall thy strength be.","verse_reference":"Deuteronomy 33:25","short_text":"As thy days, so shall thy strength be.","devotional":"Strength is measured to each day’s need. He gives exactly what today requires.","prayer":"Lord, give me strength for this day as You promise. Amen.","note":"Strength matched to the day.","day_number":84}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 84, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 85 Verse', 'Psalm 18:2', '{"verse_text":"The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower.","verse_reference":"Psalm 18:2","short_text":"The LORD is my rock, and my fortress...","devotional":"Unmovable rock, impenetrable fortress, faithful deliverer—all in one.","prayer":"Lord, You are my rock, fortress, and deliverer—my trust is in You. Amen.","note":"Everything secure in Him.","day_number":85}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 85, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 86 Verse', 'Psalm 91:2', '{"verse_text":"I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.","verse_reference":"Psalm 91:2","short_text":"I will say of the LORD, He is my refuge...","devotional":"Declare Him your refuge and fortress—trust opens the door to protection.","prayer":"Lord, You are my refuge and fortress—my God, in whom I trust. Amen.","note":"Declaration brings deliverance.","day_number":86}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 86, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 87 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD will fight for you...","devotional":"Sometimes faith looks like stillness while He battles on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":87}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 87, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 88 Verse', 'Psalm 91:4', '{"verse_text":"He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.","verse_reference":"Psalm 91:4","short_text":"He shall cover thee with his feathers...","devotional":"Under His wings you find refuge. His truth is your shield and protection.","prayer":"Lord, cover me with Your feathers and let Your truth be my shield. Amen.","note":"Wings and truth protect.","day_number":88}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 88, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 89 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"His name alone is refuge. Run to it and rise above danger.","prayer":"Lord, I run to Your name today—keep me safe in its strength. Amen.","note":"His name is perfect refuge.","day_number":89}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 89, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 90 Verse', 'Psalm 84:11', '{"verse_text":"For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly.","verse_reference":"Psalm 84:11","short_text":"For the LORD God is a sun and shield...","devotional":"He gives light and protection—no good thing is withheld from those who walk uprightly.","prayer":"Lord, You are my sun and shield—give grace and glory today. Amen.","note":"Sun and shield together.","day_number":90}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 90, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 91 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"Strength to stand, shield to protect—both found in Him. Trust turns into song.","prayer":"Lord, You are my strength and shield—my heart trusts and sings. Amen.","note":"Trust becomes praise.","day_number":91}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 91, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 92 Verse', 'Psalm 121:1', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.","verse_reference":"Psalm 121:1","short_text":"I will lift up mine eyes unto the hills...","devotional":"Help isn’t in the hills—it’s in the One who made them. Lift eyes higher.","prayer":"Lord, my help comes from You, maker of heaven and earth. Amen.","note":"Look up—help comes from the Maker.","day_number":92}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 92, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 93 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"His goodness never wavers—even when trouble arrives. He remains the safe place.","prayer":"Lord, You are my good stronghold in every trouble. Amen.","note":"Goodness meets us in trouble.","day_number":93}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 93, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 94 Verse', 'Luke 1:37', '{"verse_text":"For with God nothing shall be impossible.","verse_reference":"Luke 1:37","short_text":"For with God nothing shall be impossible.","devotional":"No word from God will ever fail. Impossibility bows to His promise.","prayer":"God, I believe—nothing is impossible with You. Amen.","note":"Impossible ends where God begins.","day_number":94}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 94, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 95 Verse', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD: be of good courage...","devotional":"Courage grows in waiting. He strengthens every heart that hopes in Him.","prayer":"Lord, give me courage to wait on You and strengthen my heart. Amen.","note":"Waiting builds strength.","day_number":95}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 95, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 96 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus calls mourning blessed because His comfort is coming—deep and sure.","prayer":"Lord, comfort me in sorrow and fulfil Your promise of blessing. Amen.","note":"Mourning opens to comfort.","day_number":96}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 96, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 97 Verse', 'Psalm 51:10', '{"verse_text":"Create in me a clean heart, O God; and renew a right spirit within me.","verse_reference":"Psalm 51:10","short_text":"Create in me a clean heart, O God...","devotional":"He doesn’t patch—He creates fresh. Renewal begins with honest prayer.","prayer":"God, create a clean heart in me and renew my spirit today. Amen.","note":"New hearts from honest prayer.","day_number":97}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 97, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 98 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace meets weakness perfectly. His power rests on those who need it most.","prayer":"Lord, Your grace is enough—show Your power in my weakness today. Amen.","note":"Grace perfects weakness.","day_number":98}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 98, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 99 Verse', 'Isaiah 26:4', '{"verse_text":"Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.","verse_reference":"Isaiah 26:4","short_text":"Trust ye in the LORD for ever...","devotional":"Everlasting strength belongs to an everlasting God. Trust in Him never expires.","prayer":"Lord, I trust in You forever—for in You is everlasting strength. Amen.","note":"Forever trust, forever strength.","day_number":99}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 99, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 100 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not His gift. He gives power, love, and clarity instead.","prayer":"Thank You, God, for Your Spirit of power, love, and a sound mind. Amen.","note":"His Spirit drives out fear.","day_number":100}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 100, id FROM ins;

-- Daily verses batch 3
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 101 Verse', 'Lamentations 3:24', '{"verse_text":"The LORD is my portion, saith my soul; therefore will I hope in him.","verse_reference":"Lamentations 3:24","short_text":"The LORD is my portion, saith my soul...","devotional":"When all else is stripped away, He remains your inheritance. Hope rises fresh every morning because of His faithfulness.","prayer":"Lord, You are my portion—my hope is in You. Renew me this morning. Amen.","note":"Fresh mercies every morning.","day_number":101}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 101, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 102 Verse', 'Psalm 136:1', '{"verse_text":"O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 136:1","short_text":"O give thanks unto the LORD; for he is good...","devotional":"His mercy endures forever—through every season, every trial, every joy. Gratitude anchors the heart to unchanging goodness.","prayer":"Lord, thank You that Your mercy endures forever. Help me give thanks today. Amen.","note":"Mercy never ends.","day_number":102}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 102, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 103 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"He is both power to stand and protection to hide behind. Trust turns His shield into a song of praise.","prayer":"Lord, You are my strength and shield—my heart trusts in You and rejoices. Amen.","note":"Trust becomes song.","day_number":103}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 103, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 104 Verse', 'Psalm 91:1', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.","verse_reference":"Psalm 91:1","short_text":"He that dwelleth in the secret place of the most High...","devotional":"Dwell close—abide under His shadow. The secret place is perfect safety in every storm.","prayer":"Lord, help me dwell in Your secret place and abide under Your shadow. Amen.","note":"Close dwelling brings covering.","day_number":104}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 104, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 105 Verse', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"A mind stayed on Him receives perfect peace. Trust is the anchor that holds calm.","prayer":"Lord, keep my mind stayed on You and surround me with perfect peace. Amen.","note":"Focused mind, perfect peace.","day_number":105}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 105, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 106 Verse', 'Lamentations 3:25', '{"verse_text":"The LORD is good unto them that wait for him, to the soul that seeketh him.","verse_reference":"Lamentations 3:25","short_text":"The LORD is good unto them that wait for him...","devotional":"Waiting on Him is never in vain. His goodness meets the seeking soul with quiet strength.","prayer":"Lord, as I wait on You, reveal Your goodness to my soul. Amen.","note":"Goodness comes to waiters.","day_number":106}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 106, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 107 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust planted in Him becomes a tree by water—blessed, fruitful, unafraid of drought.","prayer":"Lord, make me blessed as I trust and hope in You alone. Amen.","note":"Deep trust yields lasting blessing.","day_number":107}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 107, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 108 Verse', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"His presence silences every fear. Strength, help, and upholding flow from the same faithful voice.","prayer":"Lord, I will not fear—for You are with me, strengthening and upholding me. Amen.","note":"Presence silences fear.","day_number":108}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 108, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 109 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace doesn’t erase weakness—it perfects power within it. His strength shines where ours ends.","prayer":"Lord, Your grace is enough—let Your power rest on me in weakness. Amen.","note":"Grace perfects weakness.","day_number":109}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 109, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 110 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"Light to guide, salvation to secure—when He is both, fear has no place left to stand.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation remove fear.","day_number":110}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 110, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 111 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"Every weight is safe in His hands. He sustains what we release—steadfast and sure.","prayer":"I cast my burdens on You, Lord—sustain me today. Amen.","note":"He carries what we release.","day_number":111}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 111, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 112 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"No sincere cry escapes His ear. He hears, then delivers—every time.","prayer":"Lord, hear my cry today and deliver me from all troubles. Amen.","note":"Every righteous cry reaches His ear.","day_number":112}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 112, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 113 Verse', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God sees every fracture others miss. He binds up wounds with gentle, restoring hands.","prayer":"Lord, heal my broken heart and bind up my wounds today. Amen.","note":"He mends what is torn.","day_number":113}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 113, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 114 Verse', 'Psalm 103:8', '{"verse_text":"The LORD is merciful and gracious, slow to anger, and plenteous in mercy.","verse_reference":"Psalm 103:8","short_text":"The LORD is gracious, and full of compassion...","devotional":"Slow to anger, rich in mercy—His compassion remembers we are dust and meets us there.","prayer":"Lord, thank You for Your grace and compassion toward me. Amen.","note":"Mercy remembers our frailty.","day_number":114}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 114, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 115 Verse', 'Psalm 68:19', '{"verse_text":"Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation. Selah.","verse_reference":"Psalm 68:19","short_text":"Blessed be the Lord, who daily loadeth us with benefits...","devotional":"Every day overflows with fresh mercy. He loads us with good things from His generous hand.","prayer":"Blessed be You, Lord, who daily loads us with benefits. Thank You. Amen.","note":"Daily loaded with mercy.","day_number":115}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 115, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 116 Verse', 'Psalm 34:8', '{"verse_text":"O taste and see that the LORD is good: blessed is the man that trusteth in him.","verse_reference":"Psalm 34:8","short_text":"O taste and see that the LORD is good...","devotional":"Experience Him personally—taste His goodness. Trusting hearts find refuge and blessing.","prayer":"Lord, let me taste and see that You are good today. Amen.","note":"Taste leads to trust.","day_number":116}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 116, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 117 Verse', 'Psalm 29:11', '{"verse_text":"The LORD will give strength unto his people; the LORD will bless his people with peace.","verse_reference":"Psalm 29:11","short_text":"The LORD will give strength unto his people...","devotional":"His strength is given directly to His own. Peace is the companion gift that follows.","prayer":"Lord, give me strength today and bless me with Your peace. Amen.","note":"Strength and peace are His gifts.","day_number":117}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 117, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 118 Verse', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace, and sleep...","devotional":"Peace from Him makes rest possible even in chaos. Safety is found only in Him.","prayer":"Lord, let me lie down in peace and sleep, for You make me dwell in safety. Amen.","note":"Peace brings safe sleep.","day_number":118}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 118, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 119 Verse', 'Exodus 15:2', '{"verse_text":"The LORD is my strength and song, and he is become my salvation...","verse_reference":"Exodus 15:2","short_text":"The LORD is my strength and song...","devotional":"He becomes both power and melody. Victory is sung because He is salvation.","prayer":"Lord, You are my strength and song—You have become my salvation. Amen.","note":"Strength turns into song.","day_number":119}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 119, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 120 Verse', 'Deuteronomy 33:25', '{"verse_text":"...and as thy days, so shall thy strength be.","verse_reference":"Deuteronomy 33:25","short_text":"As thy days, so shall thy strength be.","devotional":"Strength arrives measured to the day’s need. He gives exactly what today requires.","prayer":"Lord, as my days are, so let my strength be. Amen.","note":"Strength matched to the day.","day_number":120}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 120, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 121 Verse', 'Psalm 145:20', '{"verse_text":"The LORD preserveth all them that love him: but all the wicked will he destroy.","verse_reference":"Psalm 145:20","short_text":"The LORD preserveth all them that love him...","devotional":"He watches closely over those who love Him. Preservation is His faithful promise.","prayer":"Lord, preserve me because I love You. Amen.","note":"Love invites preservation.","day_number":121}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 121, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 122 Verse', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.","verse_reference":"Psalm 16:11","short_text":"Thou wilt shew me the path of life...","devotional":"In His presence is fullness of joy—at His right hand, pleasures forevermore.","prayer":"Lord, show me the path of life and fill me with joy in Your presence. Amen.","note":"Fullness of joy in His presence.","day_number":122}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 122, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 123 Verse', 'Jeremiah 33:3', '{"verse_text":"Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.","verse_reference":"Jeremiah 33:3","short_text":"Call unto me, and I will answer thee...","devotional":"He invites bold asking. Great and mighty things unfold when we call.","prayer":"Lord, I call to You—reveal great and mighty things I do not know. Amen.","note":"Call and He answers.","day_number":123}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 123, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 124 Verse', 'Zephaniah 3:17', '{"verse_text":"The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.","verse_reference":"Zephaniah 3:17","short_text":"The LORD thy God in the midst of thee is mighty...","devotional":"He is right here, rejoicing over you with singing. His love quiets every fear.","prayer":"Lord, quiet me with Your love and rejoice over me today. Amen.","note":"He sings over you.","day_number":124}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 124, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 125 Verse', 'Hebrews 13:5', '{"verse_text":"...for he hath said, I will never leave thee, nor forsake thee.","verse_reference":"Hebrews 13:5","short_text":"I will never leave thee, nor forsake thee.","devotional":"His nearness is unbreakable—no circumstance can remove Him.","prayer":"Lord, thank You that You will never leave or forsake me. Amen.","note":"Never alone.","day_number":125}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 125, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 126 Verse', 'Hebrews 13:6', '{"verse_text":"So that we may boldly say, The Lord is my helper, and I will not fear what man shall do unto me.","verse_reference":"Hebrews 13:6","short_text":"The LORD is my helper...","devotional":"With Him as helper, fear loses its grip. What can man do?","prayer":"Lord, You are my helper—I will not fear what man shall do unto me. Amen.","note":"Helper stronger than any threat.","day_number":126}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 126, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 127 Verse', 'Psalm 27:10', '{"verse_text":"When my father and my mother forsake me, then the LORD will take me up.","verse_reference":"Psalm 27:10","short_text":"When my father and my mother forsake me...","devotional":"Even when closest love fails, God steps in. He takes us up with tender care.","prayer":"Lord, when others fail, take me up. Amen.","note":"He takes us up.","day_number":127}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 127, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 128 Verse', 'Deuteronomy 33:27', '{"verse_text":"The eternal God is thy refuge, and underneath are the everlasting arms...","verse_reference":"Deuteronomy 33:27","short_text":"The eternal God is thy refuge...","devotional":"Everlasting arms underneath—eternal refuge for every season.","prayer":"Lord, You are my eternal refuge—hold me in Your everlasting arms. Amen.","note":"Everlasting arms beneath.","day_number":128}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 128, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 129 Verse', 'Psalm 18:2', '{"verse_text":"The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower.","verse_reference":"Psalm 18:2","short_text":"The LORD is my rock, and my fortress...","devotional":"Unmovable rock, strong fortress, faithful deliverer—everything secure in Him.","prayer":"Lord, You are my rock, fortress, and deliverer—my trust is in You. Amen.","note":"Everything secure in Him.","day_number":129}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 129, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 130 Verse', 'Psalm 91:2', '{"verse_text":"I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.","verse_reference":"Psalm 91:2","short_text":"I will say of the LORD, He is my refuge...","devotional":"Declare Him your fortress—speaking trust opens the door to His protection.","prayer":"Lord, You are my refuge and fortress—my God, in whom I trust. Amen.","note":"Declaration brings deliverance.","day_number":130}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 130, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 131 Verse', 'Psalm 91:4', '{"verse_text":"He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.","verse_reference":"Psalm 91:4","short_text":"He shall cover thee with his feathers...","devotional":"Under His wings you find refuge. His truth becomes your shield.","prayer":"Lord, cover me with Your feathers and let Your truth be my shield. Amen.","note":"Wings and truth protect.","day_number":131}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 131, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 132 Verse', 'Psalm 84:11', '{"verse_text":"For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly.","verse_reference":"Psalm 84:11","short_text":"For the LORD God is a sun and shield...","devotional":"He gives light for the way and shield from harm—no good thing withheld.","prayer":"Lord, You are my sun and shield—give grace and glory today. Amen.","note":"Sun and shield together.","day_number":132}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 132, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 133 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD will fight for you...","devotional":"Faith sometimes looks like stillness while He battles on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":133}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 133, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 134 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"His name alone is safety. The righteous run into it and are lifted above danger.","prayer":"Lord, I run to Your name today—keep me safe in its strength. Amen.","note":"His name is perfect refuge.","day_number":134}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 134, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 135 Verse', 'Luke 1:37', '{"verse_text":"For with God nothing shall be impossible.","verse_reference":"Luke 1:37","short_text":"For with God nothing shall be impossible.","devotional":"No promise from God ever fails. Impossibility bows before His word.","prayer":"God, I believe—nothing is impossible with You. Amen.","note":"Impossible ends where God begins.","day_number":135}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 135, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 136 Verse', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD: be of good courage...","devotional":"Courage grows in the quiet space of waiting. He strengthens every hoping heart.","prayer":"Lord, give me courage to wait on You and strengthen my heart. Amen.","note":"Waiting builds strength.","day_number":136}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 136, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 137 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus calls mourning blessed—His comfort is deep, sure, and coming.","prayer":"Lord, comfort me in sorrow and fulfil Your promise of blessing. Amen.","note":"Mourning opens to comfort.","day_number":137}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 137, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 138 Verse', 'Psalm 51:10', '{"verse_text":"Create in me a clean heart, O God; and renew a right spirit within me.","verse_reference":"Psalm 51:10","short_text":"Create in me a clean heart, O God...","devotional":"He doesn’t patch—He creates fresh. Renewal begins with honest prayer.","prayer":"God, create a clean heart in me and renew my spirit today. Amen.","note":"New hearts from honest prayer.","day_number":138}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 138, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 139 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"Trouble reveals the fortress. His goodness shines brightest when storms arrive.","prayer":"Lord, You are my good stronghold—draw me near in trouble. Amen.","note":"Goodness in the storm.","day_number":139}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 139, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 140 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"He is never distant—always present, always strong when everything shakes.","prayer":"God, You are my refuge and very present help—thank You. Amen.","note":"Present help in every storm.","day_number":140}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 140, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 141 Verse', '1 Peter 1:3', '{"verse_text":"Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.","verse_reference":"1 Peter 1:3","short_text":"Blessed be the God and Father of our Lord Jesus Christ...","devotional":"Abundant mercy, living hope—all because of resurrection. Praise begins here.","prayer":"Blessed be You, God and Father of our Lord Jesus Christ. Amen.","note":"All blessing flows from the Father.","day_number":141}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 141, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 142 Verse', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded, that neither death, nor life...","devotional":"Nothing in creation can sever His love. We are held forever secure.","prayer":"Lord, thank You that nothing can separate me from Your love in Christ Jesus. Amen.","note":"His love is unbreakable.","day_number":142}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 142, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 143 Verse', 'Psalm 23:1', '{"verse_text":"The LORD is my shepherd; I shall not want.","verse_reference":"Psalm 23:1","short_text":"The LORD is my shepherd; I shall not want.","devotional":"The Shepherd knows every need before it rises. In His care, lack becomes unknown.","prayer":"Lord, thank You for being my Shepherd—help me rest in Your perfect care. Amen.","note":"In His care, lack disappears.","day_number":143}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 143, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 144 Verse', 'Matthew 5:5', '{"verse_text":"Blessed are the meek: for they shall inherit the earth.","verse_reference":"Matthew 5:5","short_text":"Blessed are the meek: for they shall inherit the earth.","devotional":"Gentle trust will one day hold everything. Meekness wins the final victory.","prayer":"God, grow meekness in me that trusts Your perfect timing. Amen.","note":"Meekness inherits the earth.","day_number":144}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 144, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 145 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Constant focus on Him keeps life steady. Nothing shakes what is anchored in Him.","prayer":"Lord, help me keep You always before me so I remain unshaken. Amen.","note":"Fixed on Him, unshaken.","day_number":145}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 145, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 146 Verse', 'Proverbs 16:3', '{"verse_text":"Commit thy works unto the LORD, and thy thoughts shall be established.","verse_reference":"Proverbs 16:3","short_text":"Commit thy works unto the LORD...","devotional":"Hand every plan to Him—He aligns thoughts and brings success.","prayer":"Lord, I commit all my works to You—establish my thoughts and plans. Amen.","note":"Committed works find direction.","day_number":146}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 146, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 147 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"He is never far. Every true call reaches Him instantly.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is always close.","day_number":147}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 147, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 148 Verse', 'Exodus 33:14', '{"verse_text":"And he said, My presence shall go with thee, and I will give thee rest.","verse_reference":"Exodus 33:14","short_text":"My presence shall go with thee, and I will give thee rest.","devotional":"His presence is the promise; rest is the gift. Peace follows where He leads.","prayer":"Lord, let Your presence go with me today and grant me deep rest. Amen.","note":"Presence brings rest.","day_number":148}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 148, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 149 Verse', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy rooted in Him becomes strength that circumstances cannot drain.","prayer":"Lord, let Your joy be my strength today and always. Amen.","note":"His joy fuels lasting strength.","day_number":149}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 149, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 150 Verse', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour and are heavy laden...","devotional":"His invitation is wide open to the weary. Rest begins with coming.","prayer":"Jesus, I come weary to You—thank You for the rest You give. Amen.","note":"Rest is found in coming.","day_number":150}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 150, id FROM ins;

-- Daily verses batch 4
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 151 Verse', 'Joshua 1:9', '{"verse_text":"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Be strong and of a good courage...","devotional":"Courage isn’t the absence of fear—it’s the presence of God. Wherever you step today, He has already gone ahead.","prayer":"God, make me strong and courageous, knowing You are with me wherever I go. Amen.","note":"You are never walking alone.","day_number":151}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 151, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 152 Verse', 'Proverbs 3:5', '{"verse_text":"Trust in the LORD with all thine heart; and lean not unto thine own understanding.","verse_reference":"Proverbs 3:5","short_text":"Trust in the LORD with all thine heart...","devotional":"Your understanding has limits; His doesn’t. Trust is surrendering the map to the One who drew the path.","prayer":"Lord, help me trust You with my whole heart and stop leaning on my limited understanding. Amen.","note":"The wisest move is to let Him lead.","day_number":152}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 152, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 153 Verse', 'John 14:27', '{"verse_text":"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","verse_reference":"John 14:27","short_text":"Peace I leave with you, my peace I give unto you...","devotional":"Not the fragile peace the world offers, but Christ’s own—unshaken by circumstances, deep enough to calm every storm inside.","prayer":"Jesus, thank You for Your gift of peace. Guard my heart from trouble and fear today. Amen.","note":"His peace guards what the world cannot touch.","day_number":153}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 153, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 154 Verse', 'Psalm 46:10', '{"verse_text":"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.","verse_reference":"Psalm 46:10","short_text":"Be still, and know that I am God...","devotional":"In the rush and noise, stillness is an act of faith. Quieting your soul declares: He is God, and that is enough.","prayer":"Lord, quiet my heart today. Help me be still and know that You are God. Amen.","note":"Stillness is worship.","day_number":154}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 154, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 155 Verse', 'Philippians 4:4', '{"verse_text":"Rejoice in the Lord always: and again I say, Rejoice.","verse_reference":"Philippians 4:4","short_text":"Rejoice in the Lord always: and again I say, Rejoice.","devotional":"Joy in the Lord isn’t a suggestion—it’s a command you can obey because He never changes. Rejoice, and again—rejoice.","prayer":"Lord, fill me with joy in You today and help me choose rejoicing no matter what comes. Amen.","note":"Rejoicing is repeated because it’s possible.","day_number":155}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 155, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 156 Verse', 'Psalm 37:4', '{"verse_text":"Delight thyself also in the LORD; and he shall give thee the desires of thine heart.","verse_reference":"Psalm 37:4","short_text":"Delight thyself also in the LORD...","devotional":"When God becomes your deepest delight, your desires begin to mirror His. He shapes what you truly want.","prayer":"Lord, teach me to delight in You above all else, trusting You with the desires of my heart. Amen.","note":"Delight changes what you desire.","day_number":156}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 156, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 157 Verse', 'Numbers 6:24', '{"verse_text":"The LORD bless thee, and keep thee:","verse_reference":"Numbers 6:24","short_text":"The LORD bless thee, and keep thee...","devotional":"An ancient blessing still spoken fresh over you today: kept safe, watched over, face-to-face with grace and peace.","prayer":"Lord, bless and keep me. Make Your face shine upon me and grant me Your perfect peace. Amen.","note":"His face toward you is your peace.","day_number":157}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 157, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 158 Verse', '1 Corinthians 16:14', '{"verse_text":"Let all your things be done with charity.","verse_reference":"1 Corinthians 16:14","short_text":"Let all your things be done with charity.","devotional":"Love isn’t just something you feel—it’s the way you do everything. Even the smallest task becomes sacred when wrapped in charity.","prayer":"Lord, let everything I do today flow from genuine love. Amen.","note":"Love is the manner of every moment.","day_number":158}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 158, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 159 Verse', 'Psalm 121:1', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.","verse_reference":"Psalm 121:1","short_text":"I will lift up mine eyes unto the hills...","devotional":"Help doesn’t come from the hills—it comes from the One who made them. Lift your eyes higher, and find strength waiting.","prayer":"Lord, my help comes from You, the maker of heaven and earth. I lift my eyes to You today. Amen.","note":"Look past the mountains to the Maker.","day_number":159}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 159, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 160 Verse', 'Psalm 119:105', '{"verse_text":"Thy word is a lamp unto my feet, and a light unto my path.","verse_reference":"Psalm 119:105","short_text":"Thy word is a lamp unto my feet...","devotional":"Not a floodlight for the whole journey, but a lamp for the next step. God’s Word gives just enough light to keep walking in the dark.","prayer":"May Your word be a lamp to my feet and a light to my path, guiding me faithfully today. Amen.","note":"One step at a time is enough when He lights it.","day_number":160}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 160, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 161 Verse', 'Jeremiah 29:11', '{"verse_text":"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.","verse_reference":"Jeremiah 29:11","short_text":"For I know the thoughts that I think toward you...","devotional":"Spoken to exiles far from home—your story isn’t ending in chaos. God already sees the peace waiting at the finish line.","prayer":"Thank You, Lord, for Your thoughts of peace toward me. Help me trust the good future You have planned. Amen.","note":"God’s mind toward you has never held harm.","day_number":161}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 161, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 162 Verse', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him; for he careth for you.","devotional":"You weren’t designed to carry the weight alone. Every worry is an invitation to hand it over to the One who already cares.","prayer":"Father, I cast every care on You today, trusting that You care for me more than I know. Amen.","note":"He cares before you cast.","day_number":162}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 162, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 163 Verse', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy isn’t the absence of sorrow—it’s the presence of God in it. His joy carries you through every circumstance.","prayer":"God, let Your joy rise in me today and become the strength I need. Amen.","note":"Joy in Him outlasts every storm.","day_number":163}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 163, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 164 Verse', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour and are heavy laden...","devotional":"Jesus doesn’t say “fix yourself first.” He says come—tired, burdened, just as you are—and find rest that reaches the soul.","prayer":"Jesus, I come to You now with all my weariness. Thank You for the rest only You can give. Amen.","note":"Rest begins with surrender.","day_number":164}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 164, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 165 Verse', 'Psalm 56:3', '{"verse_text":"What time I am afraid, I will trust in thee.","verse_reference":"Psalm 56:3","short_text":"What time I am afraid, I will trust in thee.","devotional":"Fear knocks loudly, but trust answers louder. In the exact moment anxiety rises, turn your eyes to the One who never trembles.","prayer":"When fear comes, Lord, remind me to place my trust in You completely. Amen.","note":"Fear visits; trust decides whether it stays.","day_number":165}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 165, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 166 Verse', 'Romans 8:28', '{"verse_text":"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.","verse_reference":"Romans 8:28","short_text":"And we know that all things work together for good...","devotional":"Not all things are good, but God weaves them toward good for those who love Him. Even painful threads are held in sovereign hands.","prayer":"Thank You, God, that all things work together for good. Open my eyes to see Your hand in my story. Amen.","note":"Nothing is wasted in the hands of God.","day_number":166}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 166, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 167 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"Trouble will come, but so does a fortress. God doesn’t watch from afar—He is the safe place you run into.","prayer":"Lord, You are good and my stronghold. Help me run to You in every trouble. Amen.","note":"The storm reveals the strength of your refuge.","day_number":167}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 167, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 168 Verse', 'Matthew 5:5', '{"verse_text":"Blessed are the meek: for they shall inherit the earth.","verse_reference":"Matthew 5:5","short_text":"Blessed are the meek: for they shall inherit the earth.","devotional":"Meekness isn’t weakness—it’s strength held gently, trusting God’s timing. Heaven promises the earth to those who wait in quiet faith.","prayer":"God, soften my heart with true meekness. Help me trust Your promises. Amen.","note":"Gentle hearts will hold the future.","day_number":168}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 168, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 169 Verse', 'Philippians 4:13', '{"verse_text":"I can do all things through Christ which strengtheneth me.","verse_reference":"Philippians 4:13","short_text":"I can do all things through Christ which strengtheneth me.","devotional":"Written from chains, not triumph. Real strength flows when we admit we need Him most.","prayer":"Dear Lord, I draw strength from Christ alone. Carry me through today. Amen.","note":"Your weakness is where His power begins.","day_number":169}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 169, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 170 Verse', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.","verse_reference":"Isaiah 40:31","short_text":"But they that wait upon the LORD shall renew their strength...","devotional":"Waiting feels like wasting, but it’s where wings grow. God exchanges exhaustion for energy that doesn’t fade.","prayer":"Father, teach me to wait on You patiently. Renew my strength today. Amen.","note":"Wings come to those who rest in Him.","day_number":170}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 170, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 171 Verse', 'Psalm 23:1', '{"verse_text":"The LORD is my shepherd; I shall not want.","verse_reference":"Psalm 23:1","short_text":"The LORD is my shepherd; I shall not want.","devotional":"A shepherd knows every sheep by name, leads gently, and never leaves. In His care, you lack nothing.","prayer":"Lord, thank You for being my Shepherd. Help me trust Your provision today. Amen.","note":"The Shepherd never sleeps; you can.","day_number":171}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 171, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 172 Verse', 'Genesis 1:1', '{"verse_text":"In the beginning God created the heaven and the earth.","verse_reference":"Genesis 1:1","short_text":"In the beginning God created the heaven and the earth.","devotional":"Before anything was, God spoke—and emptiness became beauty. Every sunrise echoes that first word of deliberate love.","prayer":"Heavenly Father, thank You for creation. Open my eyes to marvel at Your work today. Amen.","note":"Everything beautiful begins with God’s voice.","day_number":172}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 172, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 173 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not from Him. He gives power to stand, love to reach out, and a sound mind to think clearly.","prayer":"Thank You, God, for the spirit of power, love, and a sound mind. Drive out fear today. Amen.","note":"Fear flees where His Spirit lives.","day_number":173}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 173, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 174 Verse', 'Isaiah 40:29', '{"verse_text":"He giveth power to the faint; and to them that have no might he increaseth strength.","verse_reference":"Isaiah 40:29","short_text":"He giveth power to the faint...","devotional":"When strength runs dry, He doesn’t scold—He supplies. Fresh power for weary hearts.","prayer":"Lord, give power to my faint heart and increase strength where I have none. Amen.","note":"He specialises in weary souls.","day_number":174}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 174, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 175 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD shall fight for you...","devotional":"Sometimes the greatest act of faith is silence—standing still while God moves on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":175}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 175, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 176 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace doesn’t remove weakness—it inhabits it. His power shines brightest where we end.","prayer":"Lord, let Your grace be enough today. Show Your strength in my weakness. Amen.","note":"Grace turns weakness into glory.","day_number":176}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 176, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 177 Verse', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace belongs to the mind stayed on Him. Focus determines calm.","prayer":"Lord, keep my mind stayed on You so I may live in perfect peace. Amen.","note":"Stayed minds receive perfect peace.","day_number":177}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 177, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 178 Verse', 'Deuteronomy 33:27', '{"verse_text":"The eternal God is thy refuge, and underneath are the everlasting arms...","verse_reference":"Deuteronomy 33:27","short_text":"The eternal God is thy refuge...","devotional":"Underneath are everlasting arms—eternal refuge, eternal strength.","prayer":"Lord, You are my eternal refuge—hold me in Your everlasting arms. Amen.","note":"Everlasting arms beneath.","day_number":178}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 178, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 179 Verse', 'Hebrews 13:5', '{"verse_text":"...for he hath said, I will never leave thee, nor forsake thee.","verse_reference":"Hebrews 13:5","short_text":"I will never leave thee, nor forsake thee.","devotional":"His promise stands eternal—no circumstance can change His nearness.","prayer":"Lord, thank You that You will never leave or forsake me. Amen.","note":"Never alone.","day_number":179}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 179, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 180 Verse', 'Hebrews 13:6', '{"verse_text":"So that we may boldly say, The Lord is my helper, and I will not fear what man shall do unto me.","verse_reference":"Hebrews 13:6","short_text":"The LORD is my helper...","devotional":"With Him as helper, fear has no power. What can man do?","prayer":"Lord, You are my helper—I will not fear what man shall do unto me. Amen.","note":"Helper stronger than any threat.","day_number":180}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 180, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 181 Verse', 'Psalm 34:8', '{"verse_text":"O taste and see that the LORD is good: blessed is the man that trusteth in him.","verse_reference":"Psalm 34:8","short_text":"O taste and see that the LORD is good...","devotional":"Experience Him for yourself—taste His goodness. Those who trust find refuge and blessing.","prayer":"Lord, let me taste and see Your goodness today. Amen.","note":"Taste leads to trust.","day_number":181}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 181, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 182 Verse', 'Psalm 103:8', '{"verse_text":"The LORD is merciful and gracious, slow to anger, and plenteous in mercy.","verse_reference":"Psalm 103:8","short_text":"The LORD is merciful and gracious...","devotional":"His mercy is slow to anger, abounding in steadfast love. He remembers we are dust.","prayer":"Lord, thank You for Your mercy and grace toward me. Amen.","note":"Mercy remembers our frailty.","day_number":182}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 182, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 183 Verse', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God binds up what is shattered. His healing reaches the deepest wounds.","prayer":"Lord, heal my broken heart and bind up my wounds today. Amen.","note":"He mends what is torn.","day_number":183}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 183, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 184 Verse', 'Psalm 68:19', '{"verse_text":"Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation. Selah.","verse_reference":"Psalm 68:19","short_text":"Blessed be the Lord, who daily loadeth us with benefits...","devotional":"Every morning brings fresh mercy. He doesn’t ration blessings—He loads us daily.","prayer":"Blessed be You, Lord, who daily loads us with benefits. Thank You. Amen.","note":"Daily bread, daily benefits.","day_number":184}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 184, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 185 Verse', 'Psalm 29:11', '{"verse_text":"The LORD will give strength unto his people; the LORD will bless his people with peace.","verse_reference":"Psalm 29:11","short_text":"The LORD will give strength unto his people...","devotional":"His strength is not distant—He gives it directly to His own. Peace follows the gift.","prayer":"Lord, give me strength today and bless me with Your peace. Amen.","note":"Strength and peace are His gifts.","day_number":185}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 185, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 186 Verse', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace, and sleep...","devotional":"Peace from Him allows rest even in turmoil. He makes sleep safe.","prayer":"Lord, let me lie down in peace and sleep, for You alone make me dwell in safety. Amen.","note":"Peace brings safe sleep.","day_number":186}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 186, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 187 Verse', 'Deuteronomy 33:25', '{"verse_text":"...and as thy days, so shall thy strength be.","verse_reference":"Deuteronomy 33:25","short_text":"As thy days, so shall thy strength be.","devotional":"Strength is measured to each day’s need. He gives exactly what today requires.","prayer":"Lord, give me strength for this day as You promise. Amen.","note":"Strength matched to the day.","day_number":187}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 187, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 188 Verse', 'Psalm 145:20', '{"verse_text":"The LORD preserveth all them that love him: but all the wicked will he destroy.","verse_reference":"Psalm 145:20","short_text":"The LORD preserveth all them that love him...","devotional":"He watches over those who love Him. Preservation is His faithful response.","prayer":"Lord, preserve me because I love You. Amen.","note":"Love invites preservation.","day_number":188}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 188, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 189 Verse', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.","verse_reference":"Psalm 16:11","short_text":"Thou wilt shew me the path of life...","devotional":"In His presence is fullness of joy. He guides to the path that leads to life.","prayer":"Lord, show me the path of life and fill me with joy in Your presence. Amen.","note":"Fullness of joy in His presence.","day_number":189}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 189, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 190 Verse', 'Jeremiah 33:3', '{"verse_text":"Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.","verse_reference":"Jeremiah 33:3","short_text":"Call unto me, and I will answer thee...","devotional":"He invites you to ask great things. Prayer opens doors to things you cannot yet see.","prayer":"Lord, I call to You—show me great and mighty things. Amen.","note":"Call and He answers.","day_number":190}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 190, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 191 Verse', 'Zephaniah 3:17', '{"verse_text":"The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.","verse_reference":"Zephaniah 3:17","short_text":"The LORD thy God in the midst of thee is mighty...","devotional":"He is not distant—He is in your midst, rejoicing over you with singing. His love quiets fear.","prayer":"Lord, quiet me with Your love today. Amen.","note":"He sings over you.","day_number":191}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 191, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 192 Verse', 'Psalm 27:10', '{"verse_text":"When my father and my mother forsake me, then the LORD will take me up.","verse_reference":"Psalm 27:10","short_text":"When my father and my mother forsake me...","devotional":"Even when human love fails, God takes you up. His care never wavers.","prayer":"Lord, when others fail, take me up. Amen.","note":"He takes us up.","day_number":192}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 192, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 193 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"One name holds more safety than any fortress built by hands. Run to it and find refuge.","prayer":"Lord, at the sound of Your name I run to You. Keep me safe. Amen.","note":"His name is the safest place.","day_number":193}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 193, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 194 Verse', 'Psalm 91:4', '{"verse_text":"He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.","verse_reference":"Psalm 91:4","short_text":"He shall cover thee with his feathers...","devotional":"Under His wings you find refuge. His truth is your shield and protection.","prayer":"Lord, cover me with Your feathers and let Your truth be my shield. Amen.","note":"Wings and truth protect.","day_number":194}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 194, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 195 Verse', 'Psalm 84:11', '{"verse_text":"For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly.","verse_reference":"Psalm 84:11","short_text":"For the LORD God is a sun and shield...","devotional":"He gives light and protection—no good thing is withheld from those who walk uprightly.","prayer":"Lord, You are my sun and shield—give grace and glory today. Amen.","note":"Sun and shield together.","day_number":195}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 195, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 196 Verse', 'James 1:12', '{"verse_text":"Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.","verse_reference":"James 1:12","short_text":"Blessed is the man that endureth temptation...","devotional":"Endurance isn’t glamorous, but it leads to a crown. God never wastes a trial.","prayer":"God, strengthen me to endure temptation faithfully, eyes on the crown of life. Amen.","note":"Every resisted temptation is a step toward the crown.","day_number":196}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 196, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 197 Verse', 'Hebrews 12:1', '{"verse_text":"Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.","verse_reference":"Hebrews 12:1","short_text":"Let us run with patience the race that is set before us...","devotional":"The Christian life is a marathon, not a sprint. Patience keeps the pace steady toward the finish.","prayer":"Lord, help me run with patient endurance the race You’ve set before me. Amen.","note":"Patience wins the long race.","day_number":197}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 197, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 198 Verse', 'Philippians 4:6', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.","verse_reference":"Philippians 4:6","short_text":"Be careful for nothing; but in every thing by prayer...","devotional":"Anxiety is replaced by prayer, thanksgiving, and known requests. Peace guards the heart that prays.","prayer":"Lord, I bring everything to You in prayer with thanksgiving—replace my anxiety with Your peace. Amen.","note":"Prayer trades worry for peace.","day_number":198}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 198, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 199 Verse', 'Mark 11:24', '{"verse_text":"Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.","verse_reference":"Mark 11:24","short_text":"What things soever ye desire, when ye pray, believe...","devotional":"Prayer paired with belief moves mountains. Faith receives before it sees.","prayer":"Lord, help me pray with believing faith that receives what I ask. Amen.","note":"Believe and you will receive.","day_number":199}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 199, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 200 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"No cry from His own goes unheard. He listens, then moves—delivering from every trouble.","prayer":"Lord, hear my cry today and deliver me from all my troubles. Amen.","note":"He never misses a righteous cry.","day_number":200}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 200, id FROM ins;

-- Daily verses batch 5
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 201 Verse', 'Psalm 31:24', '{"verse_text":"Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.","verse_reference":"Psalm 31:24","short_text":"Be of good courage, and he shall strengthen your heart...","devotional":"Hope in the Lord fuels courage—He strengthens every heart that waits on Him, turning trembling into steady faith.","prayer":"Lord, help me hope in You and receive strength for my heart today. Amen.","note":"Hope strengthens the heart.","day_number":201}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 201, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 202 Verse', 'Psalm 18:2', '{"verse_text":"The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower.","verse_reference":"Psalm 18:2","short_text":"The LORD is my rock, and my fortress, and my deliverer...","devotional":"When everything shifts, He remains unmoved—solid ground beneath, strong walls around, faithful rescuer.","prayer":"Lord, You are my rock, fortress, and deliverer. I take refuge in You today. Amen.","note":"Unshakable refuge for a shaking world.","day_number":202}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 202, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 203 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Keeping Him constantly in view changes everything. Fear loses its grip when the Lord is always before you.","prayer":"Lord, help me set You always before my eyes so I will not be shaken. Amen.","note":"Eyes fixed on Him keep the heart steady.","day_number":203}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 203, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 204 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"Distance is an illusion—He is near to every sincere call. No true prayer travels far.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is closer than your next breath.","day_number":204}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 204, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 205 Verse', 'Psalm 37:5', '{"verse_text":"Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.","verse_reference":"Psalm 37:5","short_text":"Commit thy way unto the LORD; trust also in him...","devotional":"Commit your path to Him and trust—He will bring it to pass in His perfect time.","prayer":"Lord, I commit my way to You and trust You to bring it to pass. Amen.","note":"Commit and He completes.","day_number":205}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 205, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 206 Verse', 'Psalm 9:10', '{"verse_text":"And they that know thy name will put their trust in thee: for thou, LORD, hast not forsaken them that seek thee.","verse_reference":"Psalm 9:10","short_text":"And they that know thy name will put their trust in thee...","devotional":"Knowing His name invites deep trust—He never forsakes those who seek Him.","prayer":"Lord, I trust in You because I know Your name; thank You for not forsaking me. Amen.","note":"Knowing Him breeds trust.","day_number":206}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 206, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 207 Verse', 'Psalm 138:8', '{"verse_text":"The LORD will perfect that which concerneth me: thy mercy, O LORD, endureth for ever: forsake not the works of thine own hands.","verse_reference":"Psalm 138:8","short_text":"The LORD will perfect that which concerneth me...","devotional":"What concerns you is safe in His hands—He will complete it with steadfast love.","prayer":"Lord, perfect everything that concerns me according to Your lovingkindness. Amen.","note":"He finishes what concerns you.","day_number":207}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 207, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 208 Verse', 'Psalm 34:19', '{"verse_text":"Many are the afflictions of the righteous: but the LORD delivereth him out of them all.","verse_reference":"Psalm 34:19","short_text":"Many are the afflictions of the righteous: but the LORD delivereth him out of them all.","devotional":"Trouble comes to the righteous, but deliverance is certain. God rescues completely.","prayer":"Lord, deliver me from every affliction today. Amen.","note":"Deliverance follows every trial.","day_number":208}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 208, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 209 Verse', 'Lamentations 3:25', '{"verse_text":"The LORD is good unto them that wait for him, to the soul that seeketh him.","verse_reference":"Lamentations 3:25","short_text":"The LORD is good unto them that wait for him...","devotional":"Waiting on Him is never wasted. His goodness meets those who seek Him quietly.","prayer":"Lord, as I wait on You, show me Your goodness today. Amen.","note":"Goodness comes to waiters.","day_number":209}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 209, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 210 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust rooted in Him brings blessing no drought can touch—like a tree planted by water.","prayer":"Lord, bless me as I place my full trust and hope in You. Amen.","note":"Deep trust yields lasting blessing.","day_number":210}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 210, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 211 Verse', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"His presence is the end of fear. Strength, help, and upholding flow from the same voice.","prayer":"Lord, I will not fear—for You are with me, strengthening and upholding me. Amen.","note":"His ‘with you’ silences fear.","day_number":211}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 211, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 212 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace inhabits weakness—His power is made perfect where ours ends.","prayer":"Lord, Your grace is enough—let Your strength be perfected in my weakness today. Amen.","note":"Grace perfects weakness.","day_number":212}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 212, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 213 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"Light scatters darkness, salvation removes fear. With Him as both, fear has no foothold.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation leave no room for fear.","day_number":213}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 213, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 214 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"Every heavy load is safe when cast on Him. He sustains what we release.","prayer":"I cast my burdens on You, Lord—sustain me today. Amen.","note":"He never staggers under the weight.","day_number":214}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 214, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 215 Verse', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God sees every fracture others miss. He binds up wounds with gentle, restoring hands.","prayer":"Lord, heal my broken heart and bind up my wounds today. Amen.","note":"He mends what is torn.","day_number":215}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 215, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 216 Verse', 'Psalm 103:8', '{"verse_text":"The LORD is merciful and gracious, slow to anger, and plenteous in mercy.","verse_reference":"Psalm 103:8","short_text":"The LORD is merciful and gracious...","devotional":"Slow to anger, rich in mercy—His compassion remembers we are dust and meets us there.","prayer":"Lord, thank You for Your mercy and grace toward me. Amen.","note":"Mercy remembers our frailty.","day_number":216}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 216, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 217 Verse', 'Psalm 34:8', '{"verse_text":"O taste and see that the LORD is good: blessed is the man that trusteth in him.","verse_reference":"Psalm 34:8","short_text":"O taste and see that the LORD is good...","devotional":"Experience Him personally—taste His goodness. Trusting hearts find refuge and blessing.","prayer":"Lord, let me taste and see that You are good today. Amen.","note":"Taste leads to trust.","day_number":217}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 217, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 218 Verse', 'Psalm 29:11', '{"verse_text":"The LORD will give strength unto his people; the LORD will bless his people with peace.","verse_reference":"Psalm 29:11","short_text":"The LORD will give strength unto his people...","devotional":"His strength is given directly to His own. Peace is the companion gift.","prayer":"Lord, give me strength today and bless me with Your peace. Amen.","note":"Strength and peace are His gifts.","day_number":218}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 218, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 219 Verse', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace, and sleep...","devotional":"Peace from Him makes rest possible even in chaos. Safety is found only in Him.","prayer":"Lord, let me lie down in peace and sleep, for You make me dwell in safety. Amen.","note":"Peace brings safe sleep.","day_number":219}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 219, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 220 Verse', 'Deuteronomy 33:25', '{"verse_text":"...and as thy days, so shall thy strength be.","verse_reference":"Deuteronomy 33:25","short_text":"As thy days, so shall thy strength be.","devotional":"Strength arrives measured to the day’s need. He gives exactly what today requires.","prayer":"Lord, as my days are, so let my strength be. Amen.","note":"Strength matched to the day.","day_number":220}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 220, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 221 Verse', 'Psalm 145:20', '{"verse_text":"The LORD preserveth all them that love him: but all the wicked will he destroy.","verse_reference":"Psalm 145:20","short_text":"The LORD preserveth all them that love him...","devotional":"He watches closely over those who love Him. Preservation is His faithful promise.","prayer":"Lord, preserve me because I love You. Amen.","note":"Love invites preservation.","day_number":221}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 221, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 222 Verse', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.","verse_reference":"Psalm 16:11","short_text":"Thou wilt shew me the path of life...","devotional":"In His presence is fullness of joy—at His right hand, pleasures forevermore.","prayer":"Lord, show me the path of life and fill me with joy in Your presence. Amen.","note":"Fullness of joy in His presence.","day_number":222}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 222, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 223 Verse', 'Jeremiah 33:3', '{"verse_text":"Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.","verse_reference":"Jeremiah 33:3","short_text":"Call unto me, and I will answer thee...","devotional":"He invites bold asking. Great and mighty things unfold when we call.","prayer":"Lord, I call to You—reveal great and mighty things I do not know. Amen.","note":"Call and He answers.","day_number":223}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 223, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 224 Verse', 'Zephaniah 3:17', '{"verse_text":"The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.","verse_reference":"Zephaniah 3:17","short_text":"The LORD thy God in the midst of thee is mighty...","devotional":"He is right here, rejoicing over you with singing. His love quiets every fear.","prayer":"Lord, quiet me with Your love and rejoice over me today. Amen.","note":"He sings over you.","day_number":224}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 224, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 225 Verse', 'Hebrews 13:5', '{"verse_text":"...for he hath said, I will never leave thee, nor forsake thee.","verse_reference":"Hebrews 13:5","short_text":"I will never leave thee, nor forsake thee.","devotional":"His nearness is unbreakable—no circumstance can remove Him.","prayer":"Lord, thank You that You will never leave or forsake me. Amen.","note":"Never alone.","day_number":225}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 225, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 226 Verse', 'Hebrews 13:6', '{"verse_text":"So that we may boldly say, The Lord is my helper, and I will not fear what man shall do unto me.","verse_reference":"Hebrews 13:6","short_text":"The LORD is my helper...","devotional":"With Him as helper, fear loses its grip. What can man do?","prayer":"Lord, You are my helper—I will not fear what man shall do unto me. Amen.","note":"Helper stronger than any threat.","day_number":226}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 226, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 227 Verse', 'Psalm 27:10', '{"verse_text":"When my father and my mother forsake me, then the LORD will take me up.","verse_reference":"Psalm 27:10","short_text":"When my father and my mother forsake me...","devotional":"Even when closest love fails, God steps in. He takes us up with tender care.","prayer":"Lord, when others fail, take me up. Amen.","note":"He takes us up.","day_number":227}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 227, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 228 Verse', 'Deuteronomy 33:27', '{"verse_text":"The eternal God is thy refuge, and underneath are the everlasting arms...","verse_reference":"Deuteronomy 33:27","short_text":"The eternal God is thy refuge...","devotional":"Everlasting arms underneath—eternal refuge for every season.","prayer":"Lord, You are my eternal refuge—hold me in Your everlasting arms. Amen.","note":"Everlasting arms beneath.","day_number":228}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 228, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 229 Verse', '1 Peter 1:3', '{"verse_text":"Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.","verse_reference":"1 Peter 1:3","short_text":"Blessed be the God and Father of our Lord Jesus Christ...","devotional":"Abundant mercy, living hope—all because of resurrection. Praise begins here.","prayer":"Blessed be You, God and Father of our Lord Jesus Christ. Amen.","note":"All blessing flows from the Father.","day_number":229}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 229, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 230 Verse', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded, that neither death, nor life...","devotional":"Nothing in all creation can break the bond of His love. We are held forever.","prayer":"Lord, thank You that nothing can separate me from Your love in Christ Jesus. Amen.","note":"His love is unbreakable.","day_number":230}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 230, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 231 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"He is both power to stand and protection to hide behind. Trust turns His shield into song.","prayer":"Lord, You are my strength and shield—my heart trusts and rejoices. Amen.","note":"Trust becomes praise.","day_number":231}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 231, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 232 Verse', 'Psalm 91:1', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.","verse_reference":"Psalm 91:1","short_text":"He that dwelleth in the secret place of the most High...","devotional":"Dwell close—abide under His shadow. The secret place is perfect safety.","prayer":"Lord, help me dwell in Your secret place and rest under Your shadow. Amen.","note":"The secret place is the safest place.","day_number":232}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 232, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 233 Verse', 'Lamentations 3:25', '{"verse_text":"The LORD is good unto them that wait for him, to the soul that seeketh him.","verse_reference":"Lamentations 3:25","short_text":"The LORD is good unto them that wait for him...","devotional":"Waiting on Him brings goodness. His mercy meets the patient seeker.","prayer":"Lord, as I wait on You, reveal Your goodness to my soul. Amen.","note":"Goodness comes to waiters.","day_number":233}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 233, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 234 Verse', 'Psalm 136:1', '{"verse_text":"O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 136:1","short_text":"O give thanks unto the LORD; for he is good...","devotional":"His mercy endures forever—through every season, every trial, every joy.","prayer":"Lord, thank You that Your mercy endures forever. Help me give thanks today. Amen.","note":"Mercy never ends.","day_number":234}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 234, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 235 Verse', 'Lamentations 3:24', '{"verse_text":"The LORD is my portion, saith my soul; therefore will I hope in him.","verse_reference":"Lamentations 3:24","short_text":"The LORD is my portion, saith my soul...","devotional":"When all else fades, He remains your inheritance. Hope rises fresh every morning.","prayer":"Lord, You are my portion—my hope is in You. Renew me this morning. Amen.","note":"Fresh mercies every morning.","day_number":235}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 235, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 236 Verse', 'Psalm 138:8', '{"verse_text":"The LORD will perfect that which concerneth me: thy mercy, O LORD, endureth for ever: forsake not the works of thine own hands.","verse_reference":"Psalm 138:8","short_text":"The LORD will perfect that which concerneth me...","devotional":"What concerns you is safe in His hands—He will complete it with steadfast love.","prayer":"Lord, perfect everything that concerns me according to Your lovingkindness. Amen.","note":"He finishes what concerns you.","day_number":236}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 236, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 237 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust planted in Him becomes a tree by water—blessed, fruitful, unafraid.","prayer":"Lord, make me blessed as I trust and hope in You alone. Amen.","note":"Deep trust yields lasting blessing.","day_number":237}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 237, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 238 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"Light to guide, salvation to secure—fear has no place when He is both.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation remove fear.","day_number":238}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 238, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 239 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"Every weight is safe in His hands. He sustains what we release—steadfast and sure.","prayer":"I cast my burdens on You, Lord—sustain me today. Amen.","note":"He carries what we release.","day_number":239}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 239, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 240 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"No sincere cry escapes His ear. He hears, then delivers—every time.","prayer":"Lord, hear my cry today and deliver me from all troubles. Amen.","note":"Every righteous cry reaches His ear.","day_number":240}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 240, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 241 Verse', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God sees every fracture others miss. He binds up wounds with gentle hands.","prayer":"Lord, heal my broken heart and bind up my wounds today. Amen.","note":"He mends what is torn.","day_number":241}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 241, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 242 Verse', 'Psalm 103:8', '{"verse_text":"The LORD is merciful and gracious, slow to anger, and plenteous in mercy.","verse_reference":"Psalm 103:8","short_text":"The LORD is merciful and gracious...","devotional":"Slow to anger, rich in mercy—His compassion meets us in our frailty.","prayer":"Lord, thank You for Your mercy and grace toward me. Amen.","note":"Mercy remembers our frailty.","day_number":242}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 242, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 243 Verse', 'Psalm 34:8', '{"verse_text":"O taste and see that the LORD is good: blessed is the man that trusteth in him.","verse_reference":"Psalm 34:8","short_text":"O taste and see that the LORD is good...","devotional":"Experience Him personally—taste His goodness. Trusting hearts find refuge.","prayer":"Lord, let me taste and see that You are good today. Amen.","note":"Taste leads to trust.","day_number":243}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 243, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 244 Verse', 'Psalm 29:11', '{"verse_text":"The LORD will give strength unto his people; the LORD will bless his people with peace.","verse_reference":"Psalm 29:11","short_text":"The LORD will give strength unto his people...","devotional":"His strength is given directly to His own. Peace is the companion gift.","prayer":"Lord, give me strength today and bless me with Your peace. Amen.","note":"Strength and peace are His gifts.","day_number":244}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 244, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 245 Verse', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace, and sleep...","devotional":"Peace from Him makes rest possible even in chaos. Safety is found in Him.","prayer":"Lord, let me lie down in peace and sleep, for You make me dwell in safety. Amen.","note":"Peace brings safe sleep.","day_number":245}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 245, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 246 Verse', 'Deuteronomy 33:25', '{"verse_text":"...and as thy days, so shall thy strength be.","verse_reference":"Deuteronomy 33:25","short_text":"As thy days, so shall thy strength be.","devotional":"Strength arrives measured to the day’s need. He gives exactly what today requires.","prayer":"Lord, as my days are, so let my strength be. Amen.","note":"Strength matched to the day.","day_number":246}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 246, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 247 Verse', 'Psalm 145:20', '{"verse_text":"The LORD preserveth all them that love him: but all the wicked will he destroy.","verse_reference":"Psalm 145:20","short_text":"The LORD preserveth all them that love him...","devotional":"He watches over those who love Him. Preservation is His faithful promise.","prayer":"Lord, preserve me because I love You. Amen.","note":"Love invites preservation.","day_number":247}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 247, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 248 Verse', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy; at thy right hand there are pleasures for evermore.","verse_reference":"Psalm 16:11","short_text":"Thou wilt shew me the path of life...","devotional":"In His presence is fullness of joy—at His right hand, pleasures forevermore.","prayer":"Lord, show me the path of life and fill me with joy in Your presence. Amen.","note":"Fullness of joy in His presence.","day_number":248}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 248, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 249 Verse', 'Jeremiah 33:3', '{"verse_text":"Call unto me, and I will answer thee, and shew thee great and mighty things, which thou knowest not.","verse_reference":"Jeremiah 33:3","short_text":"Call unto me, and I will answer thee...","devotional":"He invites bold asking. Great and mighty things unfold when we call.","prayer":"Lord, I call to You—reveal great and mighty things I do not know. Amen.","note":"Call and He answers.","day_number":249}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 249, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 250 Verse', 'Zephaniah 3:17', '{"verse_text":"The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.","verse_reference":"Zephaniah 3:17","short_text":"The LORD thy God in the midst of thee is mighty...","devotional":"He is right here, rejoicing over you with singing. His love quiets every fear.","prayer":"Lord, quiet me with Your love and rejoice over me today. Amen.","note":"He sings over you.","day_number":250}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 250, id FROM ins;

-- Daily verses batch 6
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 251 Verse', 'Exodus 15:2', '{"verse_text":"The LORD is my strength and song, and he is become my salvation...","verse_reference":"Exodus 15:2","short_text":"The LORD is my strength and song...","devotional":"He becomes both power and melody. Victory is sung because He is salvation.","prayer":"Lord, You are my strength and song—You have become my salvation. Amen.","note":"Strength turns into song.","day_number":251}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 251, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 252 Verse', 'Lamentations 3:24', '{"verse_text":"The LORD is my portion, saith my soul; therefore will I hope in him.","verse_reference":"Lamentations 3:24","short_text":"The LORD is my portion, saith my soul...","devotional":"When everything else fades, He remains your inheritance. Hope rises fresh every morning.","prayer":"Lord, You are my portion—my hope is in You. Renew me this morning. Amen.","note":"Fresh mercies every morning.","day_number":252}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 252, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 253 Verse', 'Psalm 136:1', '{"verse_text":"O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 136:1","short_text":"O give thanks unto the LORD; for he is good...","devotional":"His mercy endures forever—through every season, every trial, every joy. Gratitude anchors the heart.","prayer":"Lord, thank You that Your mercy endures forever. Help me give thanks today. Amen.","note":"Mercy never ends.","day_number":253}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 253, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 254 Verse', 'Psalm 138:8', '{"verse_text":"The LORD will perfect that which concerneth me: thy mercy, O LORD, endureth for ever: forsake not the works of thine own hands.","verse_reference":"Psalm 138:8","short_text":"The LORD will perfect that which concerneth me...","devotional":"What concerns you is safe in His hands—He will complete it with steadfast love.","prayer":"Lord, perfect everything that concerns me according to Your lovingkindness. Amen.","note":"He finishes what concerns you.","day_number":254}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 254, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 255 Verse', 'Psalm 34:19', '{"verse_text":"Many are the afflictions of the righteous: but the LORD delivereth him out of them all.","verse_reference":"Psalm 34:19","short_text":"Many are the afflictions of the righteous: but the LORD delivereth him out of them all.","devotional":"Trouble comes, but deliverance is certain. God rescues completely from every trial.","prayer":"Lord, deliver me from every affliction today. Amen.","note":"Deliverance follows every trial.","day_number":255}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 255, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 256 Verse', 'Psalm 9:10', '{"verse_text":"And they that know thy name will put their trust in thee: for thou, LORD, hast not forsaken them that seek thee.","verse_reference":"Psalm 9:10","short_text":"And they that know thy name will put their trust in thee...","devotional":"Knowing His name invites deep trust—He never forsakes those who seek Him.","prayer":"Lord, I trust in You because I know Your name; thank You for not forsaking me. Amen.","note":"Knowing Him breeds trust.","day_number":256}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 256, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 257 Verse', 'Psalm 37:5', '{"verse_text":"Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.","verse_reference":"Psalm 37:5","short_text":"Commit thy way unto the LORD; trust also in him...","devotional":"Commit your path to Him and trust—He will bring it to pass in His perfect timing.","prayer":"Lord, I commit my way to You and trust You to bring it to pass. Amen.","note":"Commit and He completes.","day_number":257}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 257, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 258 Verse', 'Psalm 31:24', '{"verse_text":"Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.","verse_reference":"Psalm 31:24","short_text":"Be of good courage, and he shall strengthen your heart...","devotional":"Hope in the Lord fuels courage—He strengthens every heart that waits on Him.","prayer":"Lord, help me hope in You and receive strength for my heart today. Amen.","note":"Hope strengthens the heart.","day_number":258}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 258, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 259 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"He is never far—every sincere call reaches Him instantly.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is closer than your next breath.","day_number":259}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 259, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 260 Verse', 'Psalm 91:2', '{"verse_text":"I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.","verse_reference":"Psalm 91:2","short_text":"I will say of the LORD, He is my refuge...","devotional":"Declare Him your fortress—speaking trust opens the door to His protection.","prayer":"Lord, You are my refuge and fortress—my God, in whom I trust. Amen.","note":"Declaration brings deliverance.","day_number":260}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 260, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 261 Verse', 'Psalm 91:4', '{"verse_text":"He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.","verse_reference":"Psalm 91:4","short_text":"He shall cover thee with his feathers...","devotional":"Under His wings you find refuge. His truth becomes your shield.","prayer":"Lord, cover me with Your feathers and let Your truth be my shield. Amen.","note":"Wings and truth protect.","day_number":261}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 261, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 262 Verse', 'Psalm 84:11', '{"verse_text":"For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly.","verse_reference":"Psalm 84:11","short_text":"For the LORD God is a sun and shield...","devotional":"He gives light for the way and shield from harm—no good thing withheld.","prayer":"Lord, You are my sun and shield—give grace and glory today. Amen.","note":"Sun and shield together.","day_number":262}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 262, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 263 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD will fight for you...","devotional":"Faith sometimes looks like stillness while He battles on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":263}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 263, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 264 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"His name alone is safety. The righteous run into it and are lifted above danger.","prayer":"Lord, I run to Your name today—keep me safe in its strength. Amen.","note":"His name is perfect refuge.","day_number":264}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 264, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 265 Verse', 'Luke 1:37', '{"verse_text":"For with God nothing shall be impossible.","verse_reference":"Luke 1:37","short_text":"For with God nothing shall be impossible.","devotional":"No promise from God ever fails. Impossibility bows before His word.","prayer":"God, I believe—nothing is impossible with You. Amen.","note":"Impossible ends where God begins.","day_number":265}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 265, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 266 Verse', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD: be of good courage...","devotional":"Courage grows in the quiet space of waiting. He strengthens every hoping heart.","prayer":"Lord, give me courage to wait on You and strengthen my heart. Amen.","note":"Waiting builds strength.","day_number":266}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 266, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 267 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus calls mourning blessed—His comfort is deep, sure, and coming.","prayer":"Lord, comfort me in sorrow and fulfil Your promise of blessing. Amen.","note":"Mourning opens to comfort.","day_number":267}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 267, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 268 Verse', 'Psalm 51:10', '{"verse_text":"Create in me a clean heart, O God; and renew a right spirit within me.","verse_reference":"Psalm 51:10","short_text":"Create in me a clean heart, O God...","devotional":"He doesn’t patch—He creates fresh. Renewal begins with honest prayer.","prayer":"God, create a clean heart in me and renew my spirit today. Amen.","note":"New hearts from honest prayer.","day_number":268}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 268, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 269 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"Trouble reveals the fortress. His goodness shines brightest when storms arrive.","prayer":"Lord, You are my good stronghold—draw me near in trouble. Amen.","note":"Goodness in the storm.","day_number":269}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 269, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 270 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"He is never distant—always present, always strong when everything shakes.","prayer":"God, You are my refuge and very present help—thank You. Amen.","note":"Present help in every storm.","day_number":270}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 270, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 271 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace meets weakness perfectly. His power rests on those who need it most.","prayer":"Lord, Your grace is enough—show Your power in my weakness today. Amen.","note":"Grace perfects weakness.","day_number":271}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 271, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 272 Verse', 'Isaiah 26:4', '{"verse_text":"Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.","verse_reference":"Isaiah 26:4","short_text":"Trust ye in the LORD for ever...","devotional":"Everlasting strength belongs to an everlasting God. Trust in Him never expires.","prayer":"Lord, I trust in You forever—for in You is everlasting strength. Amen.","note":"Forever trust, forever strength.","day_number":272}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 272, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 273 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not His gift. He gives power, love, and clarity instead.","prayer":"Thank You, God, for Your Spirit of power, love, and a sound mind. Amen.","note":"His Spirit drives out fear.","day_number":273}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 273, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 274 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD shall fight for you...","devotional":"Faith sometimes looks like stillness while He battles on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Be still—He battles best.","day_number":274}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 274, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 275 Verse', 'Isaiah 40:29', '{"verse_text":"He giveth power to the faint; and to them that have no might he increaseth strength.","verse_reference":"Isaiah 40:29","short_text":"He giveth power to the faint...","devotional":"When strength is gone, He gives fresh power. He specialises in the weary.","prayer":"Lord, give power to my faint heart and increase my strength. Amen.","note":"Power for the powerless.","day_number":275}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 275, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 276 Verse', 'Psalm 56:11', '{"verse_text":"In God have I put my trust: I will not be afraid what man can do unto me.","verse_reference":"Psalm 56:11","short_text":"In God I have put my trust...","devotional":"Trust in God removes fear of man. Nothing can touch what He protects.","prayer":"In You I trust, God—I will not fear what man can do. Amen.","note":"Trust silences human fear.","day_number":276}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 276, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 277 Verse', 'Psalm 68:19', '{"verse_text":"Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation. Selah.","verse_reference":"Psalm 68:19","short_text":"Blessed be the Lord, who daily loadeth us with benefits...","devotional":"Every day is loaded with fresh mercy from a generous God.","prayer":"Blessed be You, Lord, who daily loads us with benefits. Thank You. Amen.","note":"Daily loaded with mercy.","day_number":277}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 277, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 278 Verse', 'John 14:1', '{"verse_text":"Let not your heart be troubled: ye believe in God, believe also in me.","verse_reference":"John 14:1","short_text":"Let not your heart be troubled...","devotional":"Jesus speaks peace into anxious hearts. Belief in Him calms every storm.","prayer":"Lord, calm my troubled heart today as I believe in You. Amen.","note":"Belief brings calm.","day_number":278}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 278, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 279 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"Light to guide, salvation to secure—fear has no place.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation remove fear.","day_number":279}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 279, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 280 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"He invites every burden. Release it daily—He sustains those who cast.","prayer":"I cast my burdens on You, Lord—sustain me and keep me steady. Amen.","note":"He carries what we release.","day_number":280}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 280, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 281 Verse', 'Psalm 111:4', '{"verse_text":"He hath made his wonderful works to be remembered: the LORD is gracious and full of compassion.","verse_reference":"Psalm 111:4","short_text":"The LORD is gracious, and full of compassion...","devotional":"His character never changes—full of grace, overflowing with compassion.","prayer":"Lord, thank You for Your gracious and compassionate heart toward me. Amen.","note":"Grace and compassion are His nature.","day_number":281}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 281, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 282 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"Every sincere cry reaches His ear. He listens and delivers.","prayer":"Lord, hear my cry today and deliver me from every trouble. Amen.","note":"Every righteous cry reaches His ear.","day_number":282}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 282, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 283 Verse', 'Mark 11:24', '{"verse_text":"Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.","verse_reference":"Mark 11:24","short_text":"What things soever ye desire, when ye pray, believe...","devotional":"Faith-filled prayer receives before the answer arrives. Believe—and it is yours.","prayer":"Lord, help me pray with bold belief that receives what I ask. Amen.","note":"Believe first, receive second.","day_number":283}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 283, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 284 Verse', 'Hebrews 12:1', '{"verse_text":"Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.","verse_reference":"Hebrews 12:1","short_text":"Let us run with patience the race that is set before us...","devotional":"The race is long, but patience keeps the stride steady. Eyes on the prize.","prayer":"Lord, help me run with patient endurance the race You have marked out for me. Amen.","note":"Patience fuels the long run.","day_number":284}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 284, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 285 Verse', 'Philippians 4:6', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.","verse_reference":"Philippians 4:6","short_text":"Be careful for nothing; but in every thing by prayer...","devotional":"Anxiety is replaced by prayer and thanksgiving. Peace follows surrendered requests.","prayer":"Lord, I bring everything to You in prayer with thanksgiving—guard my heart with Your peace. Amen.","note":"Prayer exchanges worry for peace.","day_number":285}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 285, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 286 Verse', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.","verse_reference":"Isaiah 40:31","short_text":"But they that wait upon the LORD shall renew their strength...","devotional":"Waiting on Him is active trust. He trades exhaustion for soaring strength.","prayer":"Father, as I wait on You, renew my strength to rise, run, and walk unfainting. Amen.","note":"Waiting brings wings.","day_number":286}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 286, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 287 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Constant focus on Him keeps life steady. Nothing shakes what is anchored in His presence.","prayer":"Lord, help me keep You always before me so I remain unshaken. Amen.","note":"Fixed on Him, unshaken.","day_number":287}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 287, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 288 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust rooted deep in Him brings blessing no drought can touch.","prayer":"Lord, bless me as I place my full trust and hope in You. Amen.","note":"Deep trust yields lasting blessing.","day_number":288}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 288, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 289 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not His gift. He gives power, love, and clarity instead.","prayer":"Thank You, God, for Your Spirit of power, love, and a sound mind. Amen.","note":"His Spirit drives out fear.","day_number":289}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 289, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 290 Verse', 'Proverbs 16:3', '{"verse_text":"Commit thy works unto the LORD, and thy thoughts shall be established.","verse_reference":"Proverbs 16:3","short_text":"Commit thy works unto the LORD...","devotional":"Hand every plan to Him—He aligns thoughts and brings success.","prayer":"Lord, I commit all my works to You—establish my thoughts and plans. Amen.","note":"Committed works find direction.","day_number":290}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 290, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 291 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"He is never far. Every true call reaches Him instantly.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is always close.","day_number":291}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 291, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 292 Verse', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace belongs to the mind fixed on Him. Trust anchors calm.","prayer":"Lord, keep my mind stayed on You and surround me with perfect peace. Amen.","note":"Focused mind, perfect peace.","day_number":292}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 292, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 293 Verse', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"His presence ends fear. Strength, help, and upholding flow from it.","prayer":"Lord, I will not fear—for You are with me, strengthening and upholding me. Amen.","note":"Presence silences fear.","day_number":293}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 293, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 294 Verse', 'Exodus 33:14', '{"verse_text":"And he said, My presence shall go with thee, and I will give thee rest.","verse_reference":"Exodus 33:14","short_text":"My presence shall go with thee, and I will give thee rest.","devotional":"His presence is the promise; rest is the gift. Peace follows where He leads.","prayer":"Lord, let Your presence go with me today and grant me deep rest. Amen.","note":"Presence brings rest.","day_number":294}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 294, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 295 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"His goodness shines in trouble. He remains the safe place we run to.","prayer":"Lord, You are my good stronghold—draw me near in trouble. Amen.","note":"Goodness in the storm.","day_number":295}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 295, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 296 Verse', '1 Peter 1:3', '{"verse_text":"Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.","verse_reference":"1 Peter 1:3","short_text":"Blessed be God, even the Father of our Lord Jesus Christ...","devotional":"Every blessing begins with Him—abundant mercy, living hope through resurrection.","prayer":"Blessed be You, God and Father of our Lord Jesus Christ. Amen.","note":"Praise begins every blessing.","day_number":296}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 296, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 297 Verse', 'Psalm 91:1', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.","verse_reference":"Psalm 91:1","short_text":"He that dwelleth in the secret place of the most High...","devotional":"Dwell close—rest under His shadow. The secret place is perfect safety.","prayer":"Lord, help me dwell in Your secret place and abide under Your shadow. Amen.","note":"Close dwelling brings covering.","day_number":297}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 297, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 298 Verse', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded, that neither death, nor life...","devotional":"Nothing in creation can break His love. We are held forever.","prayer":"Lord, thank You that nothing can separate me from Your love in Christ Jesus. Amen.","note":"His love is unbreakable.","day_number":298}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 298, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 299 Verse', 'Philippians 4:13', '{"verse_text":"I can do all things through Christ which strengtheneth me.","verse_reference":"Philippians 4:13","short_text":"I can do all things through Christ which strengtheneth me.","devotional":"Christ’s strength meets every need. All things become possible through Him.","prayer":"Lord, let Christ’s strength carry me through all things today. Amen.","note":"All things—through His power.","day_number":299}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 299, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 300 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"Strength to stand, shield to protect—trust turns into rejoicing.","prayer":"Lord, You are my strength and shield—my heart trusts and sings. Amen.","note":"Trust becomes song.","day_number":300}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 300, id FROM ins;

-- Daily verses batch 7
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 301 Verse', 'Joshua 1:9', '{"verse_text":"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Be strong and of a good courage...","devotional":"His command comes with His presence. Courage is rooted in the promise ‘I am with thee.’","prayer":"God, make me strong and courageous today because You are always with me. Amen.","note":"His presence breeds courage.","day_number":301}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 301, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 302 Verse', 'Jeremiah 29:11', '{"verse_text":"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.","verse_reference":"Jeremiah 29:11","short_text":"For I know the thoughts that I think toward you...","devotional":"Even in waiting, even in exile, God’s mind toward you has never changed. Peace, not harm. Future, not ruin.","prayer":"Thank You, Lord, for Your unchanging good thoughts toward me. Help me hold onto the hope You promise. Amen.","note":"Your ending was written by kindness.","day_number":302}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 302, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 303 Verse', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him; for he careth for you.","devotional":"He cares deeply—so cast freely. Every care is safe in hands that never tire.","prayer":"Father, I cast all my cares on You today, knowing You care for me. Amen.","note":"He cares enough to carry it all.","day_number":303}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 303, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 304 Verse', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy rooted in Him becomes strength that circumstances cannot drain.","prayer":"Lord, let Your joy be my strength today and always. Amen.","note":"His joy fuels lasting strength.","day_number":304}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 304, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 305 Verse', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour and are heavy laden...","devotional":"His invitation is open to the weary. Come as you are—rest is waiting.","prayer":"Jesus, I come weary to You today—thank You for giving me rest. Amen.","note":"Rest is found in coming.","day_number":305}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 305, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 306 Verse', 'Numbers 6:24', '{"verse_text":"The LORD bless thee, and keep thee:","verse_reference":"Numbers 6:24","short_text":"The LORD bless thee, and keep thee...","devotional":"Ancient words still spoken fresh: blessing, keeping, shining face, and peace.","prayer":"Lord, bless and keep me—make Your face shine and give me peace. Amen.","note":"His blessing brings peace.","day_number":306}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 306, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 307 Verse', 'Proverbs 3:5', '{"verse_text":"Trust in the LORD with all thine heart; and lean not unto thine own understanding.","verse_reference":"Proverbs 3:5","short_text":"Trust in the LORD with all thine heart...","devotional":"Wholehearted trust refuses human wisdom. His path proves perfect.","prayer":"Lord, I trust You with all my heart and lean not on my own understanding. Amen.","note":"Whole trust, perfect path.","day_number":307}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 307, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 308 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"When everything shakes, He does not. Refuge, strength, and help—always present.","prayer":"God, You are my refuge and very present help—thank You. Amen.","note":"Present help in every storm.","day_number":308}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 308, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 309 Verse', 'Psalm 37:4', '{"verse_text":"Delight thyself also in the LORD; and he shall give thee the desires of thine heart.","verse_reference":"Psalm 37:4","short_text":"Delight thyself also in the LORD...","devotional":"When He is delight, desires align with His good will—and He grants them.","prayer":"Lord, teach me to delight in You above all so my heart’s desires reflect Yours. Amen.","note":"Delight shapes desire.","day_number":309}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 309, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 310 Verse', 'John 14:27', '{"verse_text":"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","verse_reference":"John 14:27","short_text":"Peace I leave with you, my peace I give unto you...","devotional":"His peace is different—unshaken by the world. He gives it freely and fully.","prayer":"Jesus, thank You for Your peace that the world cannot take. Amen.","note":"His peace remains unshaken.","day_number":310}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 310, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 311 Verse', '1 Corinthians 16:14', '{"verse_text":"Let all your things be done with charity.","verse_reference":"1 Corinthians 16:14","short_text":"Let all your things be done with charity.","devotional":"Love is the way everything is done. Ordinary moments become sacred when charity leads.","prayer":"Lord, let everything I do today be wrapped in genuine love. Amen.","note":"Love transforms every task.","day_number":311}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 311, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 312 Verse', 'Psalm 46:10', '{"verse_text":"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.","verse_reference":"Psalm 46:10","short_text":"Be still, and know that I am God...","devotional":"Stillness is faith in action. Quieting the soul recognises His sovereignty.","prayer":"Lord, quiet my heart today—help me be still and know You are God. Amen.","note":"Stillness declares His greatness.","day_number":312}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 312, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 313 Verse', 'Philippians 4:4', '{"verse_text":"Rejoice in the Lord always: and again I say, Rejoice.","verse_reference":"Philippians 4:4","short_text":"Rejoice in the Lord always: and again I say, Rejoice.","devotional":"Rejoice is repeated because joy in Him is always possible—no matter what.","prayer":"Lord, fill me with joy in You and help me rejoice today. Amen.","note":"Rejoice—always possible in Him.","day_number":313}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 313, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 314 Verse', 'James 1:12', '{"verse_text":"Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.","verse_reference":"James 1:12","short_text":"Blessed is the man that endureth temptation...","devotional":"Endurance through trial earns a crown. Faithfulness is always rewarded.","prayer":"Lord, strengthen me to endure faithfully, eyes on the crown of life. Amen.","note":"Endurance leads to the crown.","day_number":314}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 314, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 315 Verse', 'Psalm 121:1', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.","verse_reference":"Psalm 121:1","short_text":"I will lift up mine eyes unto the hills...","devotional":"Help isn’t in creation—it’s in the Creator. Look higher.","prayer":"Lord, my help comes from You, maker of heaven and earth. Amen.","note":"Look beyond creation to the Creator.","day_number":315}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 315, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 316 Verse', 'Psalm 119:105', '{"verse_text":"Thy word is a lamp unto my feet, and a light unto my path.","verse_reference":"Psalm 119:105","short_text":"Thy word is a lamp unto my feet...","devotional":"His Word gives clear light for the next step—even when the full path is hidden.","prayer":"May Your word be a lamp to my feet and light to my path today. Amen.","note":"His Word lights every step.","day_number":316}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 316, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 317 Verse', 'Psalm 23:1', '{"verse_text":"The LORD is my shepherd; I shall not want.","verse_reference":"Psalm 23:1","short_text":"The LORD is my shepherd; I shall not want.","devotional":"The Shepherd’s care removes every true lack. Rest in His perfect provision.","prayer":"Lord, thank You for being my Shepherd—help me rest in Your perfect care. Amen.","note":"In His care, lack disappears.","day_number":317}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 317, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 318 Verse', 'Matthew 5:5', '{"verse_text":"Blessed are the meek: for they shall inherit the earth.","verse_reference":"Matthew 5:5","short_text":"Blessed are the meek: for they shall inherit the earth.","devotional":"Gentle trust will one day hold everything. Meekness wins the final victory.","prayer":"God, grow meekness in me that trusts Your perfect timing. Amen.","note":"Meekness inherits the earth.","day_number":318}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 318, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 319 Verse', 'Psalm 18:2', '{"verse_text":"The LORD is my rock, and my fortress, and my deliverer; my God, my strength, in whom I will trust; my buckler, and the horn of my salvation, and my high tower.","verse_reference":"Psalm 18:2","short_text":"The LORD is my rock, and my fortress...","devotional":"Rock to stand on, fortress to hide in, deliverer to rescue—all in Him.","prayer":"Lord, You are my rock, fortress, and deliverer—my trust is in You. Amen.","note":"Everything secure in Him.","day_number":319}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 319, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 320 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Constant focus on Him keeps life steady. Nothing shakes what is anchored in His presence.","prayer":"Lord, help me keep You always before me so I remain unshaken. Amen.","note":"Fixed on Him, unshaken.","day_number":320}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 320, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 321 Verse', 'Proverbs 18:10', '{"verse_text":"The name of the LORD is a strong tower: the righteous runneth into it, and is safe.","verse_reference":"Proverbs 18:10","short_text":"The name of the LORD is a strong tower...","devotional":"His name alone is safety. Run to it and rise above every threat.","prayer":"Lord, I run to Your name today—keep me safe in its strength. Amen.","note":"His name is perfect refuge.","day_number":321}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 321, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 322 Verse', 'Luke 1:37', '{"verse_text":"For with God nothing shall be impossible.","verse_reference":"Luke 1:37","short_text":"For with God nothing shall be impossible.","devotional":"No promise from God will ever fail. Impossibility bows before Him.","prayer":"God, I believe—nothing is impossible with You. Amen.","note":"Impossible ends with God.","day_number":322}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 322, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 323 Verse', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD: be of good courage...","devotional":"Courage grows in waiting. He strengthens every heart that hopes in Him.","prayer":"Lord, give me courage to wait on You and strengthen my heart. Amen.","note":"Waiting builds strength.","day_number":323}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 323, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 324 Verse', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn: for they shall be comforted.","devotional":"Jesus calls mourning blessed because His comfort is coming—deep and sure.","prayer":"Lord, comfort me in sorrow and fulfil Your promise of blessing. Amen.","note":"Mourning opens to comfort.","day_number":324}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 324, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 325 Verse', 'Psalm 51:10', '{"verse_text":"Create in me a clean heart, O God; and renew a right spirit within me.","verse_reference":"Psalm 51:10","short_text":"Create in me a clean heart, O God...","devotional":"He doesn’t patch—He creates fresh. Renewal begins with honest prayer.","prayer":"God, create a clean heart in me and renew my spirit today. Amen.","note":"New hearts from honest prayer.","day_number":325}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 325, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 326 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"His goodness shines in trouble. He remains the safe place we run to.","prayer":"Lord, You are my good stronghold—draw me near in trouble. Amen.","note":"Goodness in the storm.","day_number":326}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 326, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 327 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"When all shakes, He does not. Refuge, strength, and help—always present.","prayer":"God, You are my refuge and very present help—thank You. Amen.","note":"Present help in every storm.","day_number":327}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 327, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 328 Verse', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"Grace meets weakness perfectly. His power rests on those who need it most.","prayer":"Lord, Your grace is enough—show Your power in my weakness today. Amen.","note":"Grace perfects weakness.","day_number":328}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 328, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 329 Verse', 'Isaiah 26:4', '{"verse_text":"Trust ye in the LORD for ever: for in the LORD JEHOVAH is everlasting strength.","verse_reference":"Isaiah 26:4","short_text":"Trust ye in the LORD for ever...","devotional":"Everlasting strength belongs to an everlasting God. Trust in Him never expires.","prayer":"Lord, I trust in You forever—for in You is everlasting strength. Amen.","note":"Forever trust, forever strength.","day_number":329}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 329, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 330 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is foreign to His gift. He gives power to act, love to give, clarity to think.","prayer":"Thank You, God, for Your Spirit of power, love, and a sound mind. Amen.","note":"His Spirit drives out fear.","day_number":330}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 330, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 331 Verse', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD shall fight for you...","devotional":"Faith sometimes looks like stillness while He battles on your behalf.","prayer":"Lord, fight for me today as I hold my peace and trust You. Amen.","note":"Stillness while He fights.","day_number":331}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 331, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 332 Verse', 'Isaiah 40:29', '{"verse_text":"He giveth power to the faint; and to them that have no might he increaseth strength.","verse_reference":"Isaiah 40:29","short_text":"He giveth power to the faint...","devotional":"When strength is gone, He gives fresh power. He specialises in the weary.","prayer":"Lord, give power to my faint heart and increase my strength. Amen.","note":"Power for the powerless.","day_number":332}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 332, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 333 Verse', 'Psalm 56:11', '{"verse_text":"In God have I put my trust: I will not be afraid what man can do unto me.","verse_reference":"Psalm 56:11","short_text":"In God I have put my trust...","devotional":"Trust in God removes fear of man. Nothing can touch what He protects.","prayer":"In You I trust, God—I will not fear what man can do. Amen.","note":"Trust silences human fear.","day_number":333}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 333, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 334 Verse', 'Psalm 68:19', '{"verse_text":"Blessed be the Lord, who daily loadeth us with benefits, even the God of our salvation. Selah.","verse_reference":"Psalm 68:19","short_text":"Blessed be the Lord, who daily loadeth us with benefits...","devotional":"Every day is loaded with fresh mercy from a generous God.","prayer":"Blessed be You, Lord, who daily loads us with benefits. Thank You. Amen.","note":"Daily loaded with mercy.","day_number":334}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 334, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 335 Verse', 'John 14:1', '{"verse_text":"Let not your heart be troubled: ye believe in God, believe also in me.","verse_reference":"John 14:1","short_text":"Let not your heart be troubled...","devotional":"Jesus speaks peace into anxious hearts. Belief in Him calms every storm.","prayer":"Lord, calm my troubled heart today as I believe in You. Amen.","note":"Belief brings calm.","day_number":335}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 335, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 336 Verse', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"Light to guide, salvation to secure—fear has no place.","prayer":"You are my light and salvation, Lord—whom shall I fear? Amen.","note":"Light and salvation remove fear.","day_number":336}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 336, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 337 Verse', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"He invites every burden. Release it daily—He sustains those who cast.","prayer":"I cast my burdens on You, Lord—sustain me and keep me steady. Amen.","note":"He carries what we release.","day_number":337}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 337, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 338 Verse', 'Psalm 111:4', '{"verse_text":"He hath made his wonderful works to be remembered: the LORD is gracious and full of compassion.","verse_reference":"Psalm 111:4","short_text":"The LORD is gracious, and full of compassion...","devotional":"His character never changes—full of grace, overflowing with compassion.","prayer":"Lord, thank You for Your gracious and compassionate heart toward me. Amen.","note":"Grace and compassion are His nature.","day_number":338}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 338, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 339 Verse', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"Every sincere cry reaches His ear. He listens and delivers.","prayer":"Lord, hear my cry today and deliver me from every trouble. Amen.","note":"Every righteous cry reaches His ear.","day_number":339}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 339, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 340 Verse', 'Mark 11:24', '{"verse_text":"Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.","verse_reference":"Mark 11:24","short_text":"What things soever ye desire, when ye pray, believe...","devotional":"Faith-filled prayer receives before the answer arrives. Believe—and it is yours.","prayer":"Lord, help me pray with bold belief that receives what I ask. Amen.","note":"Believe first, receive second.","day_number":340}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 340, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 341 Verse', 'Hebrews 12:1', '{"verse_text":"Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.","verse_reference":"Hebrews 12:1","short_text":"Let us run with patience the race that is set before us...","devotional":"The race is long, but patience keeps the stride steady. Eyes on the prize.","prayer":"Lord, help me run with patient endurance the race You have marked out for me. Amen.","note":"Patience fuels the long run.","day_number":341}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 341, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 342 Verse', 'Philippians 4:6', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.","verse_reference":"Philippians 4:6","short_text":"Be careful for nothing; but in every thing by prayer...","devotional":"Anxiety is replaced by prayer and thanksgiving. Peace follows surrendered requests.","prayer":"Lord, I bring everything to You in prayer with thanksgiving—guard my heart with Your peace. Amen.","note":"Prayer exchanges worry for peace.","day_number":342}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 342, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 343 Verse', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.","verse_reference":"Isaiah 40:31","short_text":"But they that wait upon the LORD shall renew their strength...","devotional":"Waiting on Him is active trust. He trades exhaustion for soaring strength.","prayer":"Father, as I wait on You, renew my strength to rise, run, and walk unfainting. Amen.","note":"Waiting brings wings.","day_number":343}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 343, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 344 Verse', 'Psalm 16:8', '{"verse_text":"I have set the LORD always before me: because he is at my right hand, I shall not be moved.","verse_reference":"Psalm 16:8","short_text":"I have set the LORD always before me...","devotional":"Constant focus on Him keeps life steady. Nothing shakes what is anchored in His presence.","prayer":"Lord, help me keep You always before me so I remain unshaken. Amen.","note":"Fixed on Him, unshaken.","day_number":344}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 344, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 345 Verse', 'Jeremiah 17:7', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is.","verse_reference":"Jeremiah 17:7","short_text":"Blessed is the man that trusteth in the LORD...","devotional":"Trust rooted deep in Him brings blessing no drought can touch.","prayer":"Lord, bless me as I place my full trust and hope in You. Amen.","note":"Deep trust yields lasting blessing.","day_number":345}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 345, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 346 Verse', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not His gift. He gives power, love, and clarity instead.","prayer":"Thank You, God, for Your Spirit of power, love, and a sound mind. Amen.","note":"His Spirit drives out fear.","day_number":346}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 346, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 347 Verse', 'Proverbs 16:3', '{"verse_text":"Commit thy works unto the LORD, and thy thoughts shall be established.","verse_reference":"Proverbs 16:3","short_text":"Commit thy works unto the LORD...","devotional":"Hand every plan to Him—He aligns thoughts and brings success.","prayer":"Lord, I commit all my works to You—establish my thoughts and plans. Amen.","note":"Committed works find direction.","day_number":347}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 347, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 348 Verse', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"He is never far. Every true call reaches Him instantly.","prayer":"Lord, thank You for being near whenever I call on You in truth. Amen.","note":"He is always close.","day_number":348}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 348, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 349 Verse', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace belongs to the mind fixed on Him. Trust anchors calm.","prayer":"Lord, keep my mind stayed on You and surround me with perfect peace. Amen.","note":"Focused mind, perfect peace.","day_number":349}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 349, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 350 Verse', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"His presence ends fear. Strength, help, and upholding flow from it.","prayer":"Lord, I will not fear—for You are with me, strengthening and upholding me. Amen.","note":"Presence silences fear.","day_number":350}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 350, id FROM ins;

-- Daily verses batch 8
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 351 Verse', 'Exodus 33:14', '{"verse_text":"And he said, My presence shall go with thee, and I will give thee rest.","verse_reference":"Exodus 33:14","short_text":"My presence shall go with thee, and I will give thee rest.","devotional":"His presence is the promise; rest is the gift. Peace follows where He leads.","prayer":"Lord, let Your presence go with me today and grant me deep rest. Amen.","note":"Presence brings rest.","day_number":351}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 351, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 352 Verse', 'Nahum 1:7', '{"verse_text":"The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.","verse_reference":"Nahum 1:7","short_text":"The LORD is good, a strong hold in the day of trouble...","devotional":"His goodness shines in trouble. He remains the safe place we run to.","prayer":"Lord, You are my good stronghold—draw me near in trouble. Amen.","note":"Goodness in the storm.","day_number":352}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 352, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 353 Verse', '1 Peter 1:3', '{"verse_text":"Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead.","verse_reference":"1 Peter 1:3","short_text":"Blessed be God, even the Father of our Lord Jesus Christ...","devotional":"Every blessing begins with Him—abundant mercy, living hope through resurrection.","prayer":"Blessed be You, God and Father of our Lord Jesus Christ. Amen.","note":"Praise begins every blessing.","day_number":353}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 353, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 354 Verse', 'Psalm 91:1', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.","verse_reference":"Psalm 91:1","short_text":"He that dwelleth in the secret place of the most High...","devotional":"Dwell close—rest under His shadow. The secret place is perfect safety.","prayer":"Lord, help me dwell in Your secret place and abide under Your shadow. Amen.","note":"Close dwelling brings covering.","day_number":354}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 354, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 355 Verse', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded, that neither death, nor life...","devotional":"Nothing in creation can break His love. We are held forever.","prayer":"Lord, thank You that nothing can separate me from Your love in Christ Jesus. Amen.","note":"His love is unbreakable.","day_number":355}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 355, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 356 Verse', 'Philippians 4:13', '{"verse_text":"I can do all things through Christ which strengtheneth me.","verse_reference":"Philippians 4:13","short_text":"I can do all things through Christ which strengtheneth me.","devotional":"Christ’s strength meets every need. All things become possible through Him.","prayer":"Lord, let Christ’s strength carry me through all things today. Amen.","note":"All things—through His power.","day_number":356}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 356, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 357 Verse', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"Strength to stand, shield to protect—trust turns into rejoicing.","prayer":"Lord, You are my strength and shield—my heart trusts and sings. Amen.","note":"Trust becomes song.","day_number":357}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 357, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 358 Verse', 'Joshua 1:9', '{"verse_text":"Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Be strong and of a good courage...","devotional":"His presence makes courage possible. Fear flees where He walks.","prayer":"God, make me strong and courageous today because You are always with me. Amen.","note":"Courage grows in His presence.","day_number":358}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 358, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 359 Verse', 'Jeremiah 29:11', '{"verse_text":"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.","verse_reference":"Jeremiah 29:11","short_text":"For I know the thoughts that I think toward you...","devotional":"His thoughts are always peace and hope. The future is safe in His mind.","prayer":"Thank You, Lord, for Your thoughts of peace and hope toward me. Amen.","note":"His thoughts are always good.","day_number":359}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 359, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 360 Verse', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him; for he careth for you.","devotional":"He cares deeply—so cast freely. Every care is safe in His hands.","prayer":"Father, I cast all my cares on You today, knowing You care for me. Amen.","note":"He cares enough to carry all.","day_number":360}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 360, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 361 Verse', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy rooted in Him becomes strength that circumstances cannot drain.","prayer":"Lord, let Your joy be my strength today and always. Amen.","note":"His joy fuels lasting strength.","day_number":361}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 361, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 362 Verse', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour and are heavy laden...","devotional":"His invitation is wide open to the weary. Rest begins with coming.","prayer":"Jesus, I come weary to You—thank You for the rest You give. Amen.","note":"Rest is found in coming.","day_number":362}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 362, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 363 Verse', 'Numbers 6:24', '{"verse_text":"The LORD bless thee, and keep thee:","verse_reference":"Numbers 6:24","short_text":"The LORD bless thee, and keep thee...","devotional":"Ancient blessing still fresh: kept safe, face shining, peace granted.","prayer":"Lord, bless and keep me—make Your face shine and give me peace. Amen.","note":"His blessing brings peace.","day_number":363}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 363, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 364 Verse', 'Proverbs 3:5', '{"verse_text":"Trust in the LORD with all thine heart; and lean not unto thine own understanding.","verse_reference":"Proverbs 3:5","short_text":"Trust in the LORD with all thine heart...","devotional":"Wholehearted trust refuses human wisdom. His path proves perfect.","prayer":"Lord, I trust You with all my heart and lean not on my own understanding. Amen.","note":"Whole trust, perfect path.","day_number":364}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 364, id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Day 365 Verse', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength, a very present help in trouble.","devotional":"When all else fails, He remains. Refuge, strength, and help—always present, always faithful.","prayer":"God, You are my refuge and very present help—thank You for every day of this year. Amen.","note":"He is closer than the trouble itself.","day_number":365}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _daily_verse_ids (day_number, card_id) SELECT 365, id FROM ins;

-- Link daily verses to all active moods (weight=1)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT dv.card_id, m.id, 1
FROM _daily_verse_ids dv
CROSS JOIN moods m
WHERE m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- ============================================
-- PART 2: Mood-Specific Verses
-- ============================================

CREATE TEMP TABLE _mood_verse_ids (mood_category TEXT, card_id UUID);

-- Mood verses batch 1
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be careful for nothing; but in every thing by prayer...', 'Philippians 4:6-7', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.","verse_reference":"Philippians 4:6-7","short_text":"Be careful for nothing; but in every thing by prayer...","devotional":"Anxiety whispers that you must carry it all alone, but God invites every concern into prayer. He trades your worry for peace that stands guard over your heart.","prayer":"Lord, I bring every anxious thought to You with thanksgiving. Replace my fear with Your surpassing peace. Amen.","note":"You are not alone in the storm—His peace guards what you cannot.","mood_category":"anxious","verse_key":"anxious-phil4_6-7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fear thou not; for I am with thee...', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"When fear tightens its grip, God speaks directly: \"I am with thee.\" His hand upholds you when your strength fails.","prayer":"Father, when I am afraid, remind me You are my God. Strengthen and uphold me today. Amen.","note":"His right hand never trembles or lets go.","mood_category":"anxious","verse_key":"anxious-isa41_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For God hath not given us the spirit of fear...', '2 Timothy 1:7', '{"verse_text":"For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.","verse_reference":"2 Timothy 1:7","short_text":"For God hath not given us the spirit of fear...","devotional":"Fear is not from God—He gives power for the task, love that casts out torment, and clarity for your mind.","prayer":"Lord, replace this spirit of fear with Your power, love, and sound mind. Renew my thoughts. Amen.","note":"Fear is a liar; God''s Spirit brings truth and calm.","mood_category":"anxious","verse_key":"anxious-2tim1_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Peace I leave with you...', 'John 14:27', '{"verse_text":"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","verse_reference":"John 14:27","short_text":"Peace I leave with you...","devotional":"Jesus'' peace is steady and unshakable—different from fleeting calm. Receive it when your heart races.","prayer":"Jesus, thank You for Your peace. Calm my troubled heart and remove fear. Amen.","note":"His peace is yours to claim in the moment.","mood_category":"anxious","verse_key":"anxious-jn14_27"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Casting all your care upon him...', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him...","devotional":"Every burden is His to carry—because He truly cares. Release the weight you were never meant to bear alone.","prayer":"Lord, I cast all my cares on You because You care deeply for me. Lighten my load. Amen.","note":"You are never too much or too heavy for Him.","mood_category":"anxious","verse_key":"anxious-1pet5_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Take therefore no thought for the morrow...', 'Matthew 6:34', '{"verse_text":"Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.","verse_reference":"Matthew 6:34","short_text":"Take therefore no thought for the morrow...","devotional":"Tomorrow''s worries steal today''s peace. God gives grace for today—trust Him for what comes next.","prayer":"Father, help me live in today''s grace and release tomorrow''s fears. Amen.","note":"Today has enough grace for today.","mood_category":"anxious","verse_key":"anxious-mat6_34"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou wilt keep him in perfect peace...', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace flows when your mind rests on God, not circumstances. Trust Him fully.","prayer":"Lord, keep my mind stayed on You for perfect peace. Increase my trust. Amen.","note":"Peace flows when focus is on Him.","mood_category":"anxious","verse_key":"anxious-isa26_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'What time I am afraid...', 'Psalm 56:3', '{"verse_text":"What time I am afraid, I will trust in thee.","verse_reference":"Psalm 56:3","short_text":"What time I am afraid...","devotional":"In the very moment fear arrives, choose trust. God hears and delivers.","prayer":"Lord, when fear comes, I choose to trust You. Deliver me from fear. Amen.","note":"Trust speaks louder than fear.","mood_category":"anxious","verse_key":"anxious-ps56_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is my light and my salvation...', 'Psalm 27:1', '{"verse_text":"The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?","verse_reference":"Psalm 27:1","short_text":"The LORD is my light and my salvation...","devotional":"With God as your light and strength, fear loses its power. Whom shall you fear?","prayer":"Lord, You are my light and salvation. Banish fear from my heart. Amen.","note":"Fear fades in His light.","mood_category":"anxious","verse_key":"anxious-ps27_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Come unto me, all ye that labour...', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour...","devotional":"Jesus invites the anxious and burdened to find true rest in Him—not exhaustion.","prayer":"Jesus, I come to You heavy and tired. Give me rest today. Amen.","note":"Rest is found in surrender.","mood_category":"anxious","verse_key":"anxious-mat11_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Cast thy burden upon the LORD...', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"God promises to sustain you when you cast your burdens on Him. He will not let you fall.","prayer":"Lord, I cast my burdens on You. Sustain me and keep me steady. Amen.","note":"He never drops what you give Him.","mood_category":"anxious","verse_key":"anxious-ps55_22"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the multitude of my thoughts...', 'Psalm 94:19', '{"verse_text":"In the multitude of my thoughts within me thy comforts delight my soul.","verse_reference":"Psalm 94:19","short_text":"In the multitude of my thoughts...","devotional":"When anxious thoughts multiply, God''s comforts bring delight to your soul.","prayer":"Lord, in the multitude of my thoughts, let Your comforts delight my soul. Amen.","note":"His comforts turn chaos into peace.","mood_category":"anxious","verse_key":"anxious-ps94_19"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Heaviness in the heart...', 'Proverbs 12:25', '{"verse_text":"Heaviness in the heart of man maketh it stoop: but a good word maketh it glad.","verse_reference":"Proverbs 12:25","short_text":"Heaviness in the heart...","devotional":"Anxiety weighs down the heart, but God''s good word lifts it up again.","prayer":"Father, speak Your good word to my heavy heart today. Make me glad. Amen.","note":"A good word from Him changes everything.","mood_category":"anxious","verse_key":"anxious-prov12_25"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Have not I commanded thee...', 'Joshua 1:9', '{"verse_text":"Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Have not I commanded thee...","devotional":"God commands courage because He goes with you—every step, every fear.","prayer":"Lord, make me strong and courageous. Remind me You are with me always. Amen.","note":"You are never walking alone.","mood_category":"anxious","verse_key":"anxious-jos1_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be strong and of a good courage...', 'Deuteronomy 31:6', '{"verse_text":"Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.","verse_reference":"Deuteronomy 31:6","short_text":"Be strong and of a good courage...","devotional":"God goes before you and behind you—He will never fail or forsake.","prayer":"Father, I will not fear—You go with me and never leave. Amen.","note":"He never fails those He accompanies.","mood_category":"anxious","verse_key":"anxious-deut31_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God is our refuge and strength...', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength...","devotional":"In trouble, God is not distant—He is your immediate refuge and strength.","prayer":"Lord, be my refuge and strength in this trouble. Help me run to You. Amen.","note":"He is very present—right now.","mood_category":"anxious","verse_key":"anxious-ps46_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For ye have not received the spirit of bondage...', 'Romans 8:15', '{"verse_text":"For ye have not received the spirit of bondage again to fear; but ye have received the Spirit of adoption, whereby we cry, Abba, Father.","verse_reference":"Romans 8:15","short_text":"For ye have not received the spirit of bondage...","devotional":"Fear is bondage—God gave you the Spirit of sonship instead. You belong to Him.","prayer":"Father, thank You for adopting me. Replace fear with the cry of \"Abba\". Amen.","note":"You are His child, not a slave to fear.","mood_category":"anxious","verse_key":"anxious-rom8_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The Lord is my helper...', 'Hebrews 13:6', '{"verse_text":"The Lord is my helper, and I will not fear what man shall do unto me.","verse_reference":"Hebrews 13:6","short_text":"The Lord is my helper...","devotional":"With the Lord as your helper, human threats lose their power.","prayer":"Lord, You are my helper. I will not fear what others may do. Amen.","note":"His help is greater than any threat.","mood_category":"anxious","verse_key":"anxious-heb13_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Yea, though I walk through the valley...', 'Psalm 23:4', '{"verse_text":"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.","verse_reference":"Psalm 23:4","short_text":"Yea, though I walk through the valley...","devotional":"Even in the darkest valley, the Shepherd is with you—His presence brings comfort.","prayer":"Lord, in this valley, remind me You are with me. Comfort me with Your rod and staff. Amen.","note":"You never walk through the valley alone.","mood_category":"anxious","verse_key":"anxious-ps23_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'But now thus saith the LORD...', 'Isaiah 43:1', '{"verse_text":"But now thus saith the LORD that created thee, O Jacob, and he that formed thee, O Israel, Fear not: for I have redeemed thee, I have called thee by thy name; thou art mine.","verse_reference":"Isaiah 43:1","short_text":"But now thus saith the LORD...","devotional":"God knows your name and has redeemed you—therefore, fear not.","prayer":"Lord, thank You for calling me by name and redeeming me. I belong to You. Amen.","note":"You are His—fear has no claim.","mood_category":"anxious","verse_key":"anxious-isa43_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I sought the LORD, and he heard me...', 'Psalm 34:4', '{"verse_text":"I sought the LORD, and he heard me, and delivered me from all my fears.","verse_reference":"Psalm 34:4","short_text":"I sought the LORD, and he heard me...","devotional":"When you seek God in fear, He hears and delivers. He removes every fear.","prayer":"Lord, I seek You today—deliver me from all my fears. Amen.","note":"He hears every cry and answers.","mood_category":"anxious","verse_key":"anxious-ps34_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Trust in the LORD with all thine heart...', 'Proverbs 3:5-6', '{"verse_text":"Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.","verse_reference":"Proverbs 3:5-6","short_text":"Trust in the LORD with all thine heart...","devotional":"Leaning on your own understanding fuels anxiety—trust Him to direct your path.","prayer":"Lord, help me trust You fully and not lean on my own understanding. Direct my paths. Amen.","note":"Trust straightens the path.","mood_category":"anxious","verse_key":"anxious-prov3_5-6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The righteous cry, and the LORD heareth...', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"Your cry in anxiety reaches God—He hears and delivers from every trouble.","prayer":"Lord, I cry to You in my trouble—deliver me. Amen.","note":"He hears every cry.","mood_category":"anxious","verse_key":"anxious-ps34_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Say to them that are of a fearful heart...', 'Isaiah 35:4', '{"verse_text":"Say to them that are of a fearful heart, Be strong, fear not: behold, your God will come with vengeance, even God with a recompence; he will come and save you.","verse_reference":"Isaiah 35:4","short_text":"Say to them that are of a fearful heart...","devotional":"God speaks courage to fearful hearts: \"Be strong, fear not\"—He is coming to save.","prayer":"Lord, strengthen my fearful heart. I will not fear—You are coming. Amen.","note":"Fear not—He is coming.","mood_category":"anxious","verse_key":"anxious-isa35_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Though I walk in the midst of trouble...', 'Psalm 138:7', '{"verse_text":"Though I walk in the midst of trouble, thou wilt revive me: thou shalt stretch forth thine hand against the wrath of mine enemies, and thy right hand shall save me.","verse_reference":"Psalm 138:7","short_text":"Though I walk in the midst of trouble...","devotional":"Even in the midst of trouble, God revives you and saves with His hand.","prayer":"Lord, revive me in this trouble. Save me with Your right hand. Amen.","note":"He revives the weary.","mood_category":"anxious","verse_key":"anxious-ps138_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'There is no fear in love...', '1 John 4:18', '{"verse_text":"There is no fear in love; but perfect love casteth out fear: because fear hath torment. He that feareth is not made perfect in love.","verse_reference":"1 John 4:18","short_text":"There is no fear in love...","devotional":"Perfect love casts out fear—abide in God''s love to lose torment.","prayer":"Lord, perfect Your love in me so fear has no place. Amen.","note":"Love drives out fear.","mood_category":"anxious","verse_key":"anxious-1jn4_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou shalt not be afraid...', 'Psalm 91:5', '{"verse_text":"Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;","verse_reference":"Psalm 91:5","short_text":"Thou shalt not be afraid...","devotional":"Under God''s protection, night terrors and daily fears lose power.","prayer":"Lord, I will not be afraid—You protect me day and night. Amen.","note":"Protection covers every hour.","mood_category":"anxious","verse_key":"anxious-ps91_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The fear of man bringeth a snare...', 'Proverbs 29:25', '{"verse_text":"The fear of man bringeth a snare: but whoso putteth his trust in the LORD shall be safe.","verse_reference":"Proverbs 29:25","short_text":"The fear of man bringeth a snare...","devotional":"Fear of people traps you—trust in God brings safety.","prayer":"Lord, free me from the fear of man. Let my trust in You be my safety. Amen.","note":"Trust in Him is true safety.","mood_category":"anxious","verse_key":"anxious-prov29_25"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Behold, God is my salvation...', 'Isaiah 12:2', '{"verse_text":"Behold, God is my salvation; I will trust, and not be afraid: for the LORD JEHOVAH is my strength and my song; he also is become my salvation.","verse_reference":"Isaiah 12:2","short_text":"Behold, God is my salvation...","devotional":"God is your salvation and strength—trust Him and fear departs.","prayer":"Lord, You are my salvation. I will trust and not be afraid. Amen.","note":"Trust replaces fear with song.","mood_category":"anxious","verse_key":"anxious-isa12_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In God I will praise his word...', 'Psalm 56:4', '{"verse_text":"In God I will praise his word, in God I have put my trust; I will not fear what flesh can do unto me.","verse_reference":"Psalm 56:4","short_text":"In God I will praise his word...","devotional":"Praise God''s word and trust Him—fear of people fades.","prayer":"Lord, I praise Your word and trust You. I will not fear. Amen.","note":"Praise silences fear.","mood_category":"anxious","verse_key":"anxious-ps56_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is on my side...', 'Psalm 118:6', '{"verse_text":"The LORD is on my side; I will not fear: what can man do unto me?","verse_reference":"Psalm 118:6","short_text":"The LORD is on my side...","devotional":"With the Lord on your side, fear of man has no power.","prayer":"Lord, You are on my side. I will not fear. Amen.","note":"He is on your side.","mood_category":"anxious","verse_key":"anxious-ps118_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Blessed is the man that trusteth...', 'Jeremiah 17:7-8', '{"verse_text":"Blessed is the man that trusteth in the LORD, and whose hope the LORD is. For he shall be as a tree planted by the waters...","verse_reference":"Jeremiah 17:7-8","short_text":"Blessed is the man that trusteth...","devotional":"Trust in God makes you steady and fruitful, even in dry times.","prayer":"Lord, let my hope be in You. Plant me firmly. Amen.","note":"Trust roots you deep.","mood_category":"anxious","verse_key":"anxious-jer17_7-8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For I am persuaded...', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded...","devotional":"Nothing in all creation can separate you from God''s love—not even your deepest anxiety.","prayer":"Father, thank You that Your love holds me fast. Nothing can separate me from You. Amen.","note":"His love surrounds every fear.","mood_category":"anxious","verse_key":"anxious-rom8_38-39"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fear not; for thou shalt not be ashamed...', 'Isaiah 54:4', '{"verse_text":"Fear not; for thou shalt not be ashamed: neither be thou confounded; for thou shalt not be put to shame: for thou shalt forget the shame of thy youth, and shalt not remember the reproach of thy widowhood any more.","verse_reference":"Isaiah 54:4","short_text":"Fear not; for thou shalt not be ashamed...","devotional":"God promises you will not be put to shame—fear not, He redeems and restores.","prayer":"Lord, I will not fear shame or confusion. You are my Redeemer. Amen.","note":"He turns fear into dignity.","mood_category":"anxious","verse_key":"anxious-isa54_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Whither shall I go from thy spirit...', 'Psalm 139:7-10', '{"verse_text":"Whither shall I go from thy spirit? or whither shall I flee from thy presence? If I ascend up into heaven, thou art there: if I make my bed in hell, behold, thou art there. If I take the wings of the morning, and dwell in the uttermost parts of the sea; Even there shall thy hand lead me, and thy right hand shall hold me.","verse_reference":"Psalm 139:7-10","short_text":"Whither shall I go from thy spirit...","devotional":"You cannot outrun God''s presence—He is with you in every place, even in anxiety.","prayer":"Lord, thank You that I can never flee from Your presence. You are always near. Amen.","note":"You are never beyond His reach.","mood_category":"anxious","verse_key":"anxious-ps139_7-10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will both lay me down in peace...', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace...","devotional":"God gives peaceful sleep even when worries swirl—He alone is your safety.","prayer":"Lord, help me lie down in peace tonight. You make me dwell in safety. Amen.","note":"Peaceful sleep is His gift.","mood_category":"anxious","verse_key":"anxious-ps4_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'From the end of the earth...', 'Psalm 61:2', '{"verse_text":"From the end of the earth will I cry unto thee, when my heart is overwhelmed: lead me to the rock that is higher than I.","verse_reference":"Psalm 61:2","short_text":"From the end of the earth...","devotional":"When overwhelmed, cry to God—He leads you to the higher Rock of safety.","prayer":"Lord, when my heart is overwhelmed, lead me to You, my Rock. Amen.","note":"He lifts you above the flood.","mood_category":"anxious","verse_key":"anxious-ps61_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Commit thy way unto the LORD...', 'Psalm 37:5', '{"verse_text":"Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.","verse_reference":"Psalm 37:5","short_text":"Commit thy way unto the LORD...","devotional":"Commit your anxious path to God—trust Him, and He will bring it to pass.","prayer":"Lord, I commit my way to You. Help me trust You fully. Amen.","note":"He brings to pass what you commit.","mood_category":"anxious","verse_key":"anxious-ps37_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For I the LORD thy God will hold...', 'Isaiah 41:13', '{"verse_text":"For I the LORD thy God will hold thy right hand, saying unto thee, Fear not; I will help thee.","verse_reference":"Isaiah 41:13","short_text":"For I the LORD thy God will hold...","devotional":"God holds your right hand and says, \"Fear not\"—He will help you.","prayer":"Lord, hold my right hand and help me. I will not fear. Amen.","note":"He holds you and says \"Fear not.\"","mood_category":"anxious","verse_key":"anxious-isa41_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will lift up mine eyes...', 'Psalm 121:1-2', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.","verse_reference":"Psalm 121:1-2","short_text":"I will lift up mine eyes...","devotional":"Look up—your help comes from the Creator, not from your circumstances.","prayer":"Lord, I lift my eyes to You. My help comes from You alone. Amen.","note":"Help comes from the Maker of heaven and earth.","mood_category":"anxious","verse_key":"anxious-ps121_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'There hath no temptation taken you...', '1 Corinthians 10:13', '{"verse_text":"There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape...","verse_reference":"1 Corinthians 10:13","short_text":"There hath no temptation taken you...","devotional":"God is faithful—He will not let anxiety overwhelm you beyond what you can bear.","prayer":"Faithful God, thank You that You never let me be tempted beyond what I can bear. Amen.","note":"He is faithful in every trial.","mood_category":"anxious","verse_key":"anxious-1cor10_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He that dwelleth in the secret place...', 'Psalm 91:1-2', '{"verse_text":"He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.","verse_reference":"Psalm 91:1-2","short_text":"He that dwelleth in the secret place...","devotional":"Dwell in God''s presence—He becomes your refuge and fortress against fear.","prayer":"Lord, I dwell in Your secret place. Be my refuge and fortress. Amen.","note":"His shadow covers every fear.","mood_category":"anxious","verse_key":"anxious-ps91_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Blessed be God, even the Father...', '2 Corinthians 1:3-4', '{"verse_text":"Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation, that we may be able to comfort them which are in any trouble...","verse_reference":"2 Corinthians 1:3-4","short_text":"Blessed be God, even the Father...","devotional":"God is the Father of mercies and all comfort—He comforts you in every tribulation.","prayer":"Father of mercies, comfort me in this tribulation. Thank You for Your compassion. Amen.","note":"He comforts in every trouble.","mood_category":"anxious","verse_key":"anxious-2cor1_3-4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Like as a father pitieth...', 'Psalm 103:13-14', '{"verse_text":"Like as a father pitieth his children, so the LORD pitieth them that fear him. For he knoweth our frame; he remembereth that we are dust.","verse_reference":"Psalm 103:13-14","short_text":"Like as a father pitieth...","devotional":"God pities you with a father''s compassion—He knows your frailty and remembers you.","prayer":"Lord, thank You for Your fatherly pity. You know my frame and still love me. Amen.","note":"He remembers you are dust—and loves you anyway.","mood_category":"anxious","verse_key":"anxious-ps103_13-14"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And call upon me in the day...', 'Psalm 50:15', '{"verse_text":"And call upon me in the day of trouble: I will deliver thee, and thou shalt glorify me.","verse_reference":"Psalm 50:15","short_text":"And call upon me in the day...","devotional":"In your day of trouble, call on God—He promises deliverance.","prayer":"Lord, in this day of trouble, I call on You. Deliver me and I will glorify You. Amen.","note":"Call—He delivers.","mood_category":"anxious","verse_key":"anxious-ps50_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For if our heart condemn us...', '1 John 3:20', '{"verse_text":"For if our heart condemn us, God is greater than our heart, and knoweth all things.","verse_reference":"1 John 3:20","short_text":"For if our heart condemn us...","devotional":"Even when your heart condemns you, God is greater—He knows all and loves you still.","prayer":"Lord, You are greater than my condemning heart. Thank You for Your knowing love. Amen.","note":"He is greater than every accusation.","mood_category":"anxious","verse_key":"anxious-1jn3_20"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'It is of the LORD''s mercies...', 'Lamentations 3:22-23', '{"verse_text":"It is of the LORD''s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.","verse_reference":"Lamentations 3:22-23","short_text":"It is of the LORD''s mercies...","devotional":"His mercies are new every morning—even in anxiety, His faithfulness stands.","prayer":"Lord, thank You for new mercies this morning. Great is Your faithfulness. Amen.","note":"New mercies every day.","mood_category":"anxious","verse_key":"anxious-lam3_22-23"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'anxious', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Yea, though I walk through the valley...', 'Psalm 23:4', '{"verse_text":"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.","verse_reference":"Psalm 23:4","short_text":"Yea, though I walk through the valley...","devotional":"Even in the loneliest valley, the Shepherd never leaves. His presence turns shadows into comfort.","prayer":"Lord, walk with me through this lonely place. Let Your rod and staff comfort my heart. Amen.","note":"You are never truly alone—He is beside you.","mood_category":"lonely","verse_key":"lonely-ps23_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be strong and of a good courage...', 'Deuteronomy 31:6', '{"verse_text":"Be strong and of a good courage, fear not, nor be afraid... for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.","verse_reference":"Deuteronomy 31:6","short_text":"Be strong and of a good courage...","devotional":"God goes with you — even when no one else does. His nearness is stronger than any solitude.","prayer":"Father, remind me You go with me today. Drive away the fear of being alone. Amen.","note":"His presence is the best company.","mood_category":"lonely","verse_key":"lonely-deut31_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fear thou not; for I am with thee...', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"God speaks directly to the lonely heart: “I am with thee.” You are held, even now.","prayer":"Lord, when loneliness whispers lies, let me hear Your voice saying “I am with thee.” Amen.","note":"He is closer than any friend.","mood_category":"lonely","verse_key":"lonely-isa41_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;

-- Mood verses batch 2
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Lo, I am with you alway...', 'Matthew 28:20', '{"verse_text":"Lo, I am with you alway, even unto the end of the world. Amen.","verse_reference":"Matthew 28:20","short_text":"Lo, I am with you alway...","devotional":"Jesus’ last promise before ascending: constant companionship. You are never forsaken.","prayer":"Jesus, thank You for staying with me always. Quiet the silence with Your presence. Amen.","note":"He stays — even to the end.","mood_category":"lonely","verse_key":"lonely-matt28_20"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will never leave thee...', 'Hebrews 13:5', '{"verse_text":"Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.","verse_reference":"Hebrews 13:5","short_text":"I will never leave thee...","devotional":"God’s unbreakable promise — never leave, never forsake. Loneliness cannot override this truth.","prayer":"Father, anchor my heart in Your promise: You will never leave me. Amen.","note":"Forsaken is impossible with Him.","mood_category":"lonely","verse_key":"lonely-heb13_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God setteth the solitary in families...', 'Psalm 68:6', '{"verse_text":"God setteth the solitary in families: he bringeth out those which are bound with chains: but the rebellious dwell in a dry land.","verse_reference":"Psalm 68:6","short_text":"God setteth the solitary in families...","devotional":"God sees the solitary and places them in belonging. He is building connection even now.","prayer":"Lord, set me in the family You have for me. Release me from isolation. Amen.","note":"He turns solitude into belonging.","mood_category":"lonely","verse_key":"lonely-ps68_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will not leave you comfortless...', 'John 14:18', '{"verse_text":"I will not leave you comfortless: I will come to you.","verse_reference":"John 14:18","short_text":"I will not leave you comfortless...","devotional":"Jesus refuses to leave you comfortless. His coming is personal and near.","prayer":"Jesus, come to me today. Fill this empty space with Your comfort. Amen.","note":"Comfortless is not His plan.","mood_category":"lonely","verse_key":"lonely-jn14_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When thou passest through the waters...', 'Isaiah 43:2', '{"verse_text":"When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned...","verse_reference":"Isaiah 43:2","short_text":"When thou passest through the waters...","devotional":"God walks through every lonely flood and fire with you. You do not pass alone.","prayer":"Lord, be with me through these waters of loneliness. Hold me steady. Amen.","note":"He walks every step beside you.","mood_category":"lonely","verse_key":"lonely-isa43_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Whither shall I go from thy spirit...', 'Psalm 139:7-8', '{"verse_text":"Whither shall I go from thy spirit? or whither shall I flee from thy presence? If I ascend up into heaven, thou art there...","verse_reference":"Psalm 139:7-8","short_text":"Whither shall I go from thy spirit...","devotional":"There is no place loneliness can hide you from God. He is everywhere you are.","prayer":"Father, thank You that I cannot flee Your presence. Meet me here. Amen.","note":"You are surrounded by Him always.","mood_category":"lonely","verse_key":"lonely-ps139_7-8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Have not I commanded thee...', 'Joshua 1:9', '{"verse_text":"Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.","verse_reference":"Joshua 1:9","short_text":"Have not I commanded thee...","devotional":"God commands courage because He is with you — loneliness has no final word.","prayer":"Lord, make me strong and courageous. Remind me You are with me always. Amen.","note":"His presence banishes isolation.","mood_category":"lonely","verse_key":"lonely-jos1_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When my father and my mother forsake me...', 'Psalm 27:10', '{"verse_text":"When my father and my mother forsake me, then the LORD will take me up.","verse_reference":"Psalm 27:10","short_text":"When my father and my mother forsake me...","devotional":"Even when human love fails, God steps in as the ultimate caretaker.","prayer":"Lord, when others forsake me, take me up into Your arms. Amen.","note":"God takes up the forsaken.","mood_category":"lonely","verse_key":"lonely-ps27_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For the mountains shall depart...', 'Isaiah 54:10', '{"verse_text":"For the mountains shall depart, and the hills be removed; but my kindness shall not depart from thee, neither shall the covenant of my peace be removed...","verse_reference":"Isaiah 54:10","short_text":"For the mountains shall depart...","devotional":"God’s kindness and peace are more permanent than mountains — loneliness cannot outlast it.","prayer":"Father, let Your kindness surround me when everything else feels distant. Amen.","note":"His kindness never departs.","mood_category":"lonely","verse_key":"lonely-isa54_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Ye shall be scattered...', 'John 16:32', '{"verse_text":"Behold, the hour cometh, yea, is now come, that ye shall be scattered, every man to his own, and shall leave me alone: and yet I am not alone, because the Father is with me.","verse_reference":"John 16:32","short_text":"Ye shall be scattered...","devotional":"Even when friends scatter, Jesus was never alone — and neither are you.","prayer":"Jesus, thank You that even in abandonment, the Father is with You—and with me. Amen.","note":"The Father never leaves.","mood_category":"lonely","verse_key":"lonely-jn16_32"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God is our refuge and strength...', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength...","devotional":"When loneliness feels like trouble, God is your immediate refuge and strength.","prayer":"Lord, be my refuge and strength in this lonely moment. Help me run to You. Amen.","note":"He is very present—right now.","mood_category":"lonely","verse_key":"lonely-ps46_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'At my first answer no man stood with me...', '2 Timothy 4:16-17', '{"verse_text":"At my first answer no man stood with me, but all men forsook me... Notwithstanding the Lord stood with me, and strengthened me...","verse_reference":"2 Timothy 4:16-17","short_text":"At my first answer no man stood with me...","devotional":"Paul felt forsaken — yet the Lord stood with him. He stands with you too.","prayer":"Lord, when no one stands with me, stand with me and strengthen me. Amen.","note":"The Lord stands when others leave.","mood_category":"lonely","verse_key":"lonely-2tim4_16-17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Can a woman forget her sucking child...', 'Isaiah 49:15', '{"verse_text":"Can a woman forget her sucking child, that she should not have compassion on the son of her womb? yea, they may forget, yet will I not forget thee.","verse_reference":"Isaiah 49:15","short_text":"Can a woman forget her sucking child...","devotional":"Even a mother’s love can fail — God’s never does. You are unforgettable to Him.","prayer":"Father, thank You that You will never forget me. Hold me close. Amen.","note":"You are unforgettable to God.","mood_category":"lonely","verse_key":"lonely-isa49_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'How precious also are thy thoughts unto me...', 'Psalm 139:17-18', '{"verse_text":"How precious also are thy thoughts unto me, O God! how great is the sum of them! If I should count them, they are more in number than the sand...","verse_reference":"Psalm 139:17-18","short_text":"How precious also are thy thoughts unto me...","devotional":"God thinks about you constantly — more times than there are grains of sand.","prayer":"Lord, Your thoughts about me are precious. Let me feel seen and loved. Amen.","note":"You are always on His mind.","mood_category":"lonely","verse_key":"lonely-ps139_17-18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For I am persuaded...', 'Romans 8:38-39', '{"verse_text":"For I am persuaded, that neither death, nor life, nor angels... shall be able to separate us from the love of God, which is in Christ Jesus our Lord.","verse_reference":"Romans 8:38-39","short_text":"For I am persuaded...","devotional":"Nothing — not even loneliness — can separate you from God’s love.","prayer":"Father, thank You that nothing can separate me from Your love. Amen.","note":"Love that nothing can break.","mood_category":"lonely","verse_key":"lonely-rom8_38-39"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Yea, I have loved thee with an everlasting love...', 'Jeremiah 31:3', '{"verse_text":"The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love: therefore with lovingkindness have I drawn thee.","verse_reference":"Jeremiah 31:3","short_text":"Yea, I have loved thee with an everlasting love...","devotional":"God’s love is everlasting — it draws you even in your loneliest moment.","prayer":"Lord, draw me with Your everlasting love and lovingkindness today. Amen.","note":"Everlasting love never lets go.","mood_category":"lonely","verse_key":"lonely-jer31_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is nigh unto them...', 'Psalm 34:18', '{"verse_text":"The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.","verse_reference":"Psalm 34:18","short_text":"The LORD is nigh unto them...","devotional":"God is especially near to the lonely and broken — His nearness is your comfort.","prayer":"Lord, draw near to my lonely heart and save me in this moment. Amen.","note":"He is nearest when you feel farthest.","mood_category":"lonely","verse_key":"lonely-ps34_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I looked on my right hand...', 'Psalm 142:4', '{"verse_text":"I looked on my right hand, and beheld, but there was no man that would know me: refuge failed me; no man cared for my soul.","verse_reference":"Psalm 142:4","short_text":"I looked on my right hand...","devotional":"When no one cares or knows your pain, God sees and becomes your refuge.","prayer":"Lord, when no one cares for my soul, be my refuge and know me fully. Amen.","note":"He knows when no one else does.","mood_category":"lonely","verse_key":"lonely-ps142_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will be a Father unto you...', '2 Corinthians 6:18', '{"verse_text":"And will be a Father unto you, and ye shall be my sons and daughters, saith the Lord Almighty.","verse_reference":"2 Corinthians 6:18","short_text":"I will be a Father unto you...","devotional":"God adopts the lonely as His own children — you have a Father who never leaves.","prayer":"Father, thank You for being my Father. Let me feel Your fatherly love today. Amen.","note":"You have a Father forever.","mood_category":"lonely","verse_key":"lonely-2cor6_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He healeth the broken in heart...', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God heals the lonely, broken heart and binds every wound with care.","prayer":"Lord, heal my broken heart and bind up every wound of loneliness. Amen.","note":"He heals what loneliness breaks.","mood_category":"lonely","verse_key":"lonely-ps147_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Casting all your care upon him...', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him...","devotional":"Every lonely care is safe with God — because He truly cares for you.","prayer":"Father, I cast my lonely cares on You because You care for me. Amen.","note":"His care fills every empty place.","mood_category":"lonely","verse_key":"lonely-1pet5_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Turn thee unto me, and have mercy upon me...', 'Psalm 25:16', '{"verse_text":"Turn thee unto me, and have mercy upon me; for I am desolate and afflicted.","verse_reference":"Psalm 25:16","short_text":"Turn thee unto me, and have mercy upon me...","devotional":"In desolation and affliction, cry for God’s mercy — He turns toward you.","prayer":"Lord, turn to me in my loneliness and have mercy. I am desolate. Amen.","note":"He turns when you call.","mood_category":"lonely","verse_key":"lonely-ps25_16"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He will regard the prayer of the destitute...', 'Psalm 102:17', '{"verse_text":"He will regard the prayer of the destitute, and not despise their prayer.","verse_reference":"Psalm 102:17","short_text":"He will regard the prayer of the destitute...","devotional":"God hears the prayer of the lonely and destitute — He never despises it.","prayer":"Lord, hear my prayer in this lonely place. Do not despise my cry. Amen.","note":"Your prayer is never despised.","mood_category":"lonely","verse_key":"lonely-ps102_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For a small moment have I forsaken thee...', 'Isaiah 54:7-8', '{"verse_text":"For a small moment have I forsaken thee; but with great mercies will I gather thee.","verse_reference":"Isaiah 54:7-8","short_text":"For a small moment have I forsaken thee...","devotional":"Even if it feels like God has turned away for a moment, His mercies gather you back.","prayer":"Lord, gather me with Your great mercies. I feel forsaken — bring me near. Amen.","note":"Mercies gather the forsaken.","mood_category":"lonely","verse_key":"lonely-isa54_7-8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My God, my God, why hast thou forsaken me...', 'Psalm 22:1', '{"verse_text":"My God, my God, why hast thou forsaken me? why art thou so far from helping me, and from the words of my roaring?","verse_reference":"Psalm 22:1","short_text":"My God, my God, why hast thou forsaken me...","devotional":"Even Jesus felt forsaken — yet God answered. Your cry is heard too.","prayer":"Lord Jesus, You felt forsaken — thank You for understanding my loneliness. Hear me. Amen.","note":"He understands the cry of forsakenness.","mood_category":"lonely","verse_key":"lonely-ps22_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'It is of the LORD''s mercies...', 'Lamentations 3:22-23', '{"verse_text":"It is of the LORD''s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.","verse_reference":"Lamentations 3:22-23","short_text":"It is of the LORD''s mercies...","devotional":"In loneliness, God’s mercies renew every morning — you are not consumed.","prayer":"Lord, thank You for mercies new every morning. Renew me today. Amen.","note":"Mercies renew in loneliness.","mood_category":"lonely","verse_key":"lonely-lam3_22-23"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Blessed be God, even the Father...', '2 Corinthians 1:3-4', '{"verse_text":"Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation...","verse_reference":"2 Corinthians 1:3-4","short_text":"Blessed be God, even the Father...","devotional":"God is the Father of mercies and all comfort — He comforts you in lonely tribulation.","prayer":"Father of mercies, comfort me in this lonely tribulation. Thank You for Your compassion. Amen.","note":"He comforts in every lonely trouble.","mood_category":"lonely","verse_key":"lonely-2cor1_3-4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For he hath not despised nor abhorred...', 'Psalm 22:24', '{"verse_text":"For he hath not despised nor abhorred the affliction of the afflicted; neither hath he hid his face from him; but when he cried unto him, he heard.","verse_reference":"Psalm 22:24","short_text":"For he hath not despised nor abhorred...","devotional":"God never despises or hides from the afflicted and lonely — He hears every cry.","prayer":"Lord, thank You for not despising my affliction. You hear when I cry. Amen.","note":"He hears the lonely cry.","mood_category":"lonely","verse_key":"lonely-ps22_24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD heareth the poor...', 'Psalm 69:33', '{"verse_text":"For the LORD heareth the poor, and despiseth not his prisoners.","verse_reference":"Psalm 69:33","short_text":"The LORD heareth the poor...","devotional":"God hears the poor and lonely — He despises no one in their prison of isolation.","prayer":"Lord, hear me in my loneliness. I am not despised by You. Amen.","note":"He hears the poor in spirit.","mood_category":"lonely","verse_key":"lonely-ps69_33"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD also will be a refuge...', 'Psalm 9:9', '{"verse_text":"The LORD also will be a refuge for the oppressed, a refuge in times of trouble.","verse_reference":"Psalm 9:9","short_text":"The LORD also will be a refuge...","devotional":"God is a refuge for the oppressed and lonely — your safe place in trouble.","prayer":"Lord, be my refuge in this lonely time of trouble. I run to You. Amen.","note":"He is refuge for the lonely.","mood_category":"lonely","verse_key":"lonely-ps9_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Trust in him at all times...', 'Psalm 62:8', '{"verse_text":"Trust in him at all times; ye people, pour out your heart before him: God is a refuge for us.","verse_reference":"Psalm 62:8","short_text":"Trust in him at all times...","devotional":"Pour out your lonely heart to God — He is your refuge at all times.","prayer":"Lord, I pour out my heart to You in loneliness. Be my refuge. Amen.","note":"Pour out — He listens.","mood_category":"lonely","verse_key":"lonely-ps62_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I cried unto thee, O LORD...', 'Psalm 142:5', '{"verse_text":"I cried unto thee, O LORD: I said, Thou art my refuge and my portion in the land of the living.","verse_reference":"Psalm 142:5","short_text":"I cried unto thee, O LORD...","devotional":"In loneliness, cry to God — He is your refuge and portion.","prayer":"Lord, You are my refuge and portion. Hear my cry in this lonely land. Amen.","note":"He is your portion in loneliness.","mood_category":"lonely","verse_key":"lonely-ps142_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He shall call upon me, and I will answer...', 'Psalm 91:15', '{"verse_text":"He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him.","verse_reference":"Psalm 91:15","short_text":"He shall call upon me, and I will answer...","devotional":"Call on God in loneliness — He answers, stays with you, delivers, and honors.","prayer":"Lord, I call on You today. Be with me in trouble and deliver me. Amen.","note":"He answers every lonely call.","mood_category":"lonely","verse_key":"lonely-ps91_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is nigh unto all them that call upon him...', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them that call upon him...","devotional":"God is near to every true cry — loneliness ends when you call.","prayer":"Lord, I call upon You in truth. Draw near to me in this loneliness. Amen.","note":"He is nigh to every caller.","mood_category":"lonely","verse_key":"lonely-ps145_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the day of my trouble I will call upon thee...', 'Psalm 86:7', '{"verse_text":"In the day of my trouble I will call upon thee: for thou wilt answer me.","verse_reference":"Psalm 86:7","short_text":"In the day of my trouble I will call upon thee...","devotional":"In the day of lonely trouble, call — God promises to answer.","prayer":"Lord, in this day of trouble, I call on You. You will answer me. Amen.","note":"He answers in trouble.","mood_category":"lonely","verse_key":"lonely-ps86_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The righteous cry, and the LORD heareth...', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry, and the LORD heareth...","devotional":"Your lonely cry reaches God — He hears and delivers from every trouble.","prayer":"Lord, I cry to You in my loneliness. Hear me and deliver me. Amen.","note":"He hears every lonely cry.","mood_category":"lonely","verse_key":"lonely-ps34_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And the LORD, he it is that doth go before thee...', 'Deuteronomy 31:8', '{"verse_text":"And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.","verse_reference":"Deuteronomy 31:8","short_text":"And the LORD, he it is that doth go before thee...","devotional":"God Himself goes ahead of you in every step — loneliness fades when He leads the way.","prayer":"Lord, go before me today. Remind me You will never fail or forsake me. Amen.","note":"He leads — you follow in His company.","mood_category":"lonely","verse_key":"lonely-deut31_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And the LORD God said, It is not good...', 'Genesis 2:18', '{"verse_text":"And the LORD God said, It is not good that the man should be alone; I will make him an help meet for him.","verse_reference":"Genesis 2:18","short_text":"And the LORD God said, It is not good...","devotional":"From the beginning, God knew solitude was not good — He provides companionship in His perfect time.","prayer":"Father, thank You for seeing my need. Provide the help and connection You designed. Amen.","note":"God designed us for relationship.","mood_category":"lonely","verse_key":"lonely-gen2_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou wilt keep him in perfect peace...', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Fix your mind on God amid loneliness — His perfect peace guards your heart.","prayer":"Lord, keep my mind stayed on You. Grant me perfect peace in this lonely season. Amen.","note":"Peace comes from trusting Him.","mood_category":"lonely","verse_key":"lonely-isa26_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Come unto me, all ye that labour...', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour...","devotional":"Jesus invites the weary and lonely to come — find true rest in His arms.","prayer":"Jesus, I come to You heavy with loneliness. Give me the rest only You provide. Amen.","note":"Rest for the lonely soul.","mood_category":"lonely","verse_key":"lonely-matt11_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'A father of the fatherless...', 'Psalm 68:5', '{"verse_text":"A father of the fatherless, and a judge of the widows, is God in his holy habitation.","verse_reference":"Psalm 68:5","short_text":"A father of the fatherless...","devotional":"God is Father to the fatherless and defender of the vulnerable — He fills every empty role.","prayer":"Lord, be my Father in this loneliness. Defend and care for me as only You can. Amen.","note":"He fathers the fatherless.","mood_category":"lonely","verse_key":"lonely-ps68_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I watch, and am as a sparrow alone...', 'Psalm 102:7', '{"verse_text":"I watch, and am as a sparrow alone upon the house top.","verse_reference":"Psalm 102:7","short_text":"I watch, and am as a sparrow alone...","devotional":"Even in feeling like a solitary sparrow, God sees and draws near to your watchful heart.","prayer":"Father, in my aloneness like a sparrow, watch over me and draw me close. Amen.","note":"He notices the solitary sparrow.","mood_category":"lonely","verse_key":"lonely-ps102_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Nevertheless I am continually with thee...', 'Psalm 73:23', '{"verse_text":"Nevertheless I am continually with thee: thou hast holden me by my right hand.","verse_reference":"Psalm 73:23","short_text":"Nevertheless I am continually with thee...","devotional":"Even when life feels uncertain, God holds your hand — constant companionship.","prayer":"Lord, thank You for holding me by my right hand. I am continually with You. Amen.","note":"Held by His right hand.","mood_category":"lonely","verse_key":"lonely-ps73_23"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be strong and of good courage...', '1 Chronicles 28:20', '{"verse_text":"And David said to Solomon his son, Be strong and of good courage, and do it: fear not, nor be dismayed: for the LORD God, even my God, will be with thee; he will not fail thee, nor forsake thee...","verse_reference":"1 Chronicles 28:20","short_text":"Be strong and of good courage...","devotional":"God’s presence empowers courage — He will not fail or forsake you in any task.","prayer":"Lord, make me strong and courageous. Be with me and never forsake me. Amen.","note":"Strength in His unfailing presence.","mood_category":"lonely","verse_key":"lonely-1chr28_20"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I have been young, and now am old...', 'Psalm 37:25', '{"verse_text":"I have been young, and now am old; yet have I not seen the righteous forsaken, nor his seed begging bread.","verse_reference":"Psalm 37:25","short_text":"I have been young, and now am old...","devotional":"A lifetime testimony: God never forsakes the righteous — you will not be left alone.","prayer":"Father, thank You that the righteous are never forsaken. Sustain me today. Amen.","note":"Never forsaken — a lifetime promise.","mood_category":"lonely","verse_key":"lonely-ps37_25"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'These things I have spoken unto you...', 'John 16:33', '{"verse_text":"These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.","verse_reference":"John 16:33","short_text":"These things I have spoken unto you...","devotional":"In a world of trouble and loneliness, Jesus gives peace — He has overcome.","prayer":"Jesus, thank You for peace in tribulation. Cheer my heart; You have overcome. Amen.","note":"Peace in the Overcomer.","mood_category":"lonely","verse_key":"lonely-jn16_33"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Hereby know we that we dwell in him...', '1 John 4:13', '{"verse_text":"Hereby know we that we dwell in him, and he in us, because he hath given us of his Spirit.","verse_reference":"1 John 4:13","short_text":"Hereby know we that we dwell in him...","devotional":"God’s Spirit dwells in you — intimate union that banishes true loneliness forever.","prayer":"Lord, thank You for Your Spirit within me. Let me sense Your dwelling presence. Amen.","note":"He dwells in you.","mood_category":"lonely","verse_key":"lonely-1jn4_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'lonely', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'This is the day which the LORD hath made...', 'Psalm 118:24', '{"verse_text":"This is the day which the LORD hath made; we will rejoice and be glad in it.","verse_reference":"Psalm 118:24","short_text":"This is the day which the LORD hath made...","devotional":"Every day is shaped by God’s hand and filled with purpose. Rejoicing honors the Giver.","prayer":"Lord, thank You for this day You have made. Help me rejoice in it fully. Amen.","note":"Joy sanctifies the day.","mood_category":"joyful","verse_key":"joyful-ps118_24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The joy of the LORD is your strength...', 'Nehemiah 8:10', '{"verse_text":"Then he said unto them, Go your way... for the joy of the LORD is your strength.","verse_reference":"Nehemiah 8:10","short_text":"The joy of the LORD is your strength...","devotional":"Joy anchored in God becomes strength when life presses hard.","prayer":"Father, let Your joy strengthen me today. Amen.","note":"Joy empowers endurance.","mood_category":"joyful","verse_key":"joyful-neh8_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In thy presence is fulness of joy...', 'Psalm 16:11', '{"verse_text":"Thou wilt shew me the path of life: in thy presence is fulness of joy...","verse_reference":"Psalm 16:11","short_text":"In thy presence is fulness of joy...","devotional":"God’s presence is the birthplace of lasting joy.","prayer":"Lord, draw me near and fill me with joy in Your presence. Amen.","note":"Joy lives near God.","mood_category":"joyful","verse_key":"joyful-ps16_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;

-- Mood verses batch 3
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'That my joy might remain in you...', 'John 15:11', '{"verse_text":"These things have I spoken unto you, that my joy might remain in you...","verse_reference":"John 15:11","short_text":"That my joy might remain in you...","devotional":"Jesus gives His own joy — steady, full, and enduring.","prayer":"Jesus, let Your joy remain in me today. Amen.","note":"His joy abides.","mood_category":"joyful","verse_key":"joyful-jhn15_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Joy cometh in the morning...', 'Psalm 30:5', '{"verse_text":"Weeping may endure for a night, but joy cometh in the morning.","verse_reference":"Psalm 30:5","short_text":"Joy cometh in the morning...","devotional":"God never wastes the night — joy always follows.","prayer":"Father, thank You that joy comes with the morning. Amen.","note":"Joy follows sorrow.","mood_category":"joyful","verse_key":"joyful-ps30_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Ye shall go out with joy...', 'Isaiah 55:12', '{"verse_text":"For ye shall go out with joy, and be led forth with peace...","verse_reference":"Isaiah 55:12","short_text":"Ye shall go out with joy...","devotional":"God leads His people forward with joy and peace.","prayer":"Lord, lead me today in joy and peace. Amen.","note":"Joy marks obedience.","mood_category":"joyful","verse_key":"joyful-isa55_12"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Our mouth was filled with laughter...', 'Psalm 126:2', '{"verse_text":"Then was our mouth filled with laughter, and our tongue with singing...","verse_reference":"Psalm 126:2","short_text":"Our mouth was filled with laughter...","devotional":"Restoration turns sorrow into laughter.","prayer":"Lord, restore my joy until praise overflows. Amen.","note":"Joy restores.","mood_category":"joyful","verse_key":"joyful-ps126_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fill you with all joy...', 'Romans 15:13', '{"verse_text":"Now the God of hope fill you with all joy and peace in believing...","verse_reference":"Romans 15:13","short_text":"Fill you with all joy...","devotional":"Hope-filled faith overflows with joy.","prayer":"God of hope, fill me with joy today. Amen.","note":"Hope births joy.","mood_category":"joyful","verse_key":"joyful-rom15_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The fruit of the Spirit is joy...', 'Galatians 5:22', '{"verse_text":"But the fruit of the Spirit is love, joy, peace...","verse_reference":"Galatians 5:22","short_text":"The fruit of the Spirit is joy...","devotional":"Joy grows where the Spirit is welcomed.","prayer":"Holy Spirit, grow Your joy in me. Amen.","note":"Joy is cultivated.","mood_category":"joyful","verse_key":"joyful-gal5_22"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Serve the LORD with gladness...', 'Psalm 100:2', '{"verse_text":"Serve the LORD with gladness...","verse_reference":"Psalm 100:2","short_text":"Serve the LORD with gladness...","devotional":"Glad service is joyful worship.","prayer":"Lord, let me serve You with gladness. Amen.","note":"Gladness honors God.","mood_category":"joyful","verse_key":"joyful-ps100_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'A merry heart doeth good...', 'Proverbs 17:22', '{"verse_text":"A merry heart doeth good like a medicine...","verse_reference":"Proverbs 17:22","short_text":"A merry heart doeth good...","devotional":"Joy refreshes both body and soul.","prayer":"Lord, give me a merry heart rooted in You. Amen.","note":"Joy heals.","mood_category":"joyful","verse_key":"joyful-prov17_22"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou hast put gladness in my heart...', 'Psalm 4:7', '{"verse_text":"Thou hast put gladness in my heart...","verse_reference":"Psalm 4:7","short_text":"Thou hast put gladness in my heart...","devotional":"God-given gladness surpasses abundance.","prayer":"Lord, thank You for gladness that comes from You alone. Amen.","note":"Gladness is divine.","mood_category":"joyful","verse_key":"joyful-ps4_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Rejoice evermore...', '1 Thessalonians 5:16', '{"verse_text":"Rejoice evermore.","verse_reference":"1 Thessalonians 5:16","short_text":"Rejoice evermore...","devotional":"Joy is a continual act of trust.","prayer":"Lord, teach me to rejoice always. Amen.","note":"Joy is constant.","mood_category":"joyful","verse_key":"joyful-1thess5_16"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Gladness for the upright...', 'Psalm 97:11', '{"verse_text":"Light is sown for the righteous, and gladness for the upright in heart.","verse_reference":"Psalm 97:11","short_text":"Gladness for the upright...","devotional":"God plants joy ahead of the faithful.","prayer":"Lord, thank You for the gladness You have prepared. Amen.","note":"Joy is planted.","mood_category":"joyful","verse_key":"joyful-ps97_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'They joy before thee...', 'Isaiah 9:3', '{"verse_text":"They joy before thee according to the joy in harvest...","verse_reference":"Isaiah 9:3","short_text":"They joy before thee...","devotional":"Joy multiplies when God brings increase.","prayer":"Lord, I rejoice before You with thanksgiving. Amen.","note":"Joy multiplies.","mood_category":"joyful","verse_key":"joyful-isa9_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Rejoice in the LORD...', 'Psalm 33:1', '{"verse_text":"Rejoice in the LORD, O ye righteous...","verse_reference":"Psalm 33:1","short_text":"Rejoice in the LORD...","devotional":"Joyful praise fits the upright.","prayer":"Lord, help me rejoice in You. Amen.","note":"Joy fits righteousness.","mood_category":"joyful","verse_key":"joyful-ps33_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will bless the LORD at all times...', 'Psalm 34:1', '{"verse_text":"I will bless the LORD at all times...","verse_reference":"Psalm 34:1","short_text":"I will bless the LORD at all times...","devotional":"Joy praises God continually.","prayer":"Lord, let praise always be in my mouth. Amen.","note":"Joy is continual praise.","mood_category":"joyful","verse_key":"joyful-ps34_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O magnify the LORD with me...', 'Psalm 34:3', '{"verse_text":"O magnify the LORD with me...","verse_reference":"Psalm 34:3","short_text":"O magnify the LORD with me...","devotional":"Joy grows when shared.","prayer":"Lord, help me magnify You with others. Amen.","note":"Joy is shared.","mood_category":"joyful","verse_key":"joyful-ps34_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Clap your hands...', 'Psalm 47:1', '{"verse_text":"O clap your hands, all ye people...","verse_reference":"Psalm 47:1","short_text":"Clap your hands...","devotional":"Joy celebrates God openly.","prayer":"Lord, I rejoice and shout to You. Amen.","note":"Joy celebrates.","mood_category":"joyful","verse_key":"joyful-ps47_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Restore unto me the joy...', 'Psalm 51:12', '{"verse_text":"Restore unto me the joy of thy salvation...","verse_reference":"Psalm 51:12","short_text":"Restore unto me the joy...","devotional":"God gladly restores joy when we ask.","prayer":"Lord, restore the joy of Your salvation in me. Amen.","note":"Joy is restorable.","mood_category":"joyful","verse_key":"joyful-ps51_12"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Because thy lovingkindness...', 'Psalm 63:3', '{"verse_text":"Because thy lovingkindness is better than life...","verse_reference":"Psalm 63:3","short_text":"Because thy lovingkindness...","devotional":"God’s love fuels joyful praise.","prayer":"Lord, Your lovingkindness fills me with joy. Amen.","note":"Love births joy.","mood_category":"joyful","verse_key":"joyful-ps63_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Make a joyful noise unto God...', 'Psalm 66:1', '{"verse_text":"Make a joyful noise unto God, all ye lands.","verse_reference":"Psalm 66:1","short_text":"Make a joyful noise unto God...","devotional":"Joy lifts its voice to God.","prayer":"Lord, I joyfully praise You today. Amen.","note":"Joy makes noise.","mood_category":"joyful","verse_key":"joyful-ps66_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let us make a joyful noise...', 'Psalm 95:1', '{"verse_text":"Let us make a joyful noise to the rock of our salvation.","verse_reference":"Psalm 95:1","short_text":"Let us make a joyful noise...","devotional":"Joy flows from salvation.","prayer":"Lord, You are my Rock and my joy. Amen.","note":"Salvation brings joy.","mood_category":"joyful","verse_key":"joyful-ps95_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O sing unto the LORD...', 'Psalm 98:1', '{"verse_text":"O sing unto the LORD a new song...","verse_reference":"Psalm 98:1","short_text":"O sing unto the LORD...","devotional":"Joy responds with fresh praise.","prayer":"Lord, I sing You a new song today. Amen.","note":"Joy sings anew.","mood_category":"joyful","verse_key":"joyful-ps98_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Sing unto the LORD with the harp...', 'Psalm 98:5', '{"verse_text":"Sing unto the LORD with the harp...","verse_reference":"Psalm 98:5","short_text":"Sing unto the LORD with the harp...","devotional":"Joy praises skillfully and gladly.","prayer":"Lord, I praise You with joy. Amen.","note":"Joy is expressive.","mood_category":"joyful","verse_key":"joyful-ps98_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Make a joyful noise...', 'Psalm 100:1', '{"verse_text":"Make a joyful noise unto the LORD, all ye lands.","verse_reference":"Psalm 100:1","short_text":"Make a joyful noise...","devotional":"Joy is universal praise.","prayer":"Lord, I join all lands in joyful praise. Amen.","note":"Joy is global.","mood_category":"joyful","verse_key":"joyful-ps100_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Bless the LORD, O my soul...', 'Psalm 103:1', '{"verse_text":"Bless the LORD, O my soul...","verse_reference":"Psalm 103:1","short_text":"Bless the LORD, O my soul...","devotional":"Joy engages the whole soul.","prayer":"Lord, with all that is within me, I bless You. Amen.","note":"Whole-soul joy.","mood_category":"joyful","verse_key":"joyful-ps103_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thy testimonies... are the rejoicing of my heart', 'Psalm 119:111', '{"verse_text":"Thy testimonies have I taken as an heritage for ever: for they are the rejoicing of my heart.","verse_reference":"Psalm 119:111","short_text":"Thy testimonies... are the rejoicing of my heart","devotional":"God’s Word is a lasting source of joy.","prayer":"Lord, let Your Word rejoice my heart. Amen.","note":"Joy in Scripture.","mood_category":"joyful","verse_key":"joyful-ps119_111"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I rejoice at thy word...', 'Psalm 119:162', '{"verse_text":"I rejoice at thy word, as one that findeth great spoil.","verse_reference":"Psalm 119:162","short_text":"I rejoice at thy word...","devotional":"God’s Word brings rich joy.","prayer":"Lord, help me rejoice in Your Word. Amen.","note":"Joy treasures truth.","mood_category":"joyful","verse_key":"joyful-ps119_162"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Every day will I bless thee...', 'Psalm 145:2', '{"verse_text":"Every day will I bless thee...","verse_reference":"Psalm 145:2","short_text":"Every day will I bless thee...","devotional":"Joy turns every day into praise.","prayer":"Lord, every day I will bless You. Amen.","note":"Daily joy.","mood_category":"joyful","verse_key":"joyful-ps145_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'While I live will I praise...', 'Psalm 146:2', '{"verse_text":"While I live will I praise the LORD...","verse_reference":"Psalm 146:2","short_text":"While I live will I praise...","devotional":"Joy lasts as long as life.","prayer":"Lord, while I live, I will praise You. Amen.","note":"Living joy.","mood_category":"joyful","verse_key":"joyful-ps146_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise is comely...', 'Psalm 147:1', '{"verse_text":"Praise ye the LORD: for it is good to sing praises...","verse_reference":"Psalm 147:1","short_text":"Praise is comely...","devotional":"Joy finds beauty in praise.","prayer":"Lord, my joy rises in praise to You. Amen.","note":"Joy is fitting.","mood_category":"joyful","verse_key":"joyful-ps147_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise ye the LORD from the heavens...', 'Psalm 148:1', '{"verse_text":"Praise ye the LORD from the heavens...","verse_reference":"Psalm 148:1","short_text":"Praise ye the LORD from the heavens...","devotional":"Joy joins all creation.","prayer":"Lord, I praise You with heaven and earth. Amen.","note":"Cosmic joy.","mood_category":"joyful","verse_key":"joyful-ps148_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let Israel rejoice...', 'Psalm 149:2', '{"verse_text":"Let Israel rejoice in him that made him...","verse_reference":"Psalm 149:2","short_text":"Let Israel rejoice...","devotional":"Joy remembers its Maker.","prayer":"Lord, I rejoice in You who made me. Amen.","note":"Joy remembers God.","mood_category":"joyful","verse_key":"joyful-ps149_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise God in his sanctuary...', 'Psalm 150:1', '{"verse_text":"Praise God in his sanctuary...","verse_reference":"Psalm 150:1","short_text":"Praise God in his sanctuary...","devotional":"Joy fills God’s dwelling with praise.","prayer":"Lord, I praise You in Your sanctuary. Amen.","note":"Joy dwells in praise.","mood_category":"joyful","verse_key":"joyful-ps150_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise him for his mighty acts...', 'Psalm 150:2', '{"verse_text":"Praise him for his mighty acts...","verse_reference":"Psalm 150:2","short_text":"Praise him for his mighty acts...","devotional":"Joy responds to God’s power.","prayer":"Lord, I praise You for Your mighty works. Amen.","note":"Joy responds.","mood_category":"joyful","verse_key":"joyful-ps150_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise him with the sound of the trumpet...', 'Psalm 150:3', '{"verse_text":"Praise him with the sound of the trumpet...","verse_reference":"Psalm 150:3","short_text":"Praise him with the sound of the trumpet...","devotional":"Joy uses every voice.","prayer":"Lord, let my joy sound in praise. Amen.","note":"Joy resounds.","mood_category":"joyful","verse_key":"joyful-ps150_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise him with the timbrel...', 'Psalm 150:4', '{"verse_text":"Praise him with the timbrel and dance...","verse_reference":"Psalm 150:4","short_text":"Praise him with the timbrel...","devotional":"Joy engages the whole body.","prayer":"Lord, I praise You with joyful movement. Amen.","note":"Joy moves.","mood_category":"joyful","verse_key":"joyful-ps150_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise him upon the loud cymbals...', 'Psalm 150:5', '{"verse_text":"Praise him upon the loud cymbals...","verse_reference":"Psalm 150:5","short_text":"Praise him upon the loud cymbals...","devotional":"Joy is unashamed praise.","prayer":"Lord, let my praise be bold. Amen.","note":"Joy is bold.","mood_category":"joyful","verse_key":"joyful-ps150_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let every thing that hath breath...', 'Psalm 150:6', '{"verse_text":"Let every thing that hath breath praise the LORD.","verse_reference":"Psalm 150:6","short_text":"Let every thing that hath breath...","devotional":"Joy ends in praise.","prayer":"Lord, with every breath I praise You. Amen.","note":"Breath is praise.","mood_category":"joyful","verse_key":"joyful-ps150_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My heart trusted in him...', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"My heart trusted in him...","devotional":"Joy rises from trust placed fully in the Lord.","prayer":"Lord, my heart trusts You and rejoices in Your help. Amen.","note":"Joy follows trust.","mood_category":"joyful","verse_key":"joyful-ps28_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My soul shall be joyful...', 'Psalm 35:9', '{"verse_text":"And my soul shall be joyful in the LORD: it shall rejoice in his salvation.","verse_reference":"Psalm 35:9","short_text":"My soul shall be joyful...","devotional":"Salvation awakens deep joy in the soul.","prayer":"Lord, my soul rejoices in Your salvation. Amen.","note":"Joy springs from salvation.","mood_category":"joyful","verse_key":"joyful-ps35_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let such as love thy salvation...', 'Psalm 40:16', '{"verse_text":"Let all those that seek thee rejoice and be glad in thee...","verse_reference":"Psalm 40:16","short_text":"Let such as love thy salvation...","devotional":"Seeking God leads naturally to joy.","prayer":"Lord, as I seek You, let joy rise within me. Amen.","note":"Joy marks seekers.","mood_category":"joyful","verse_key":"joyful-ps40_16"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The righteous shall be glad...', 'Psalm 64:10', '{"verse_text":"The righteous shall be glad in the LORD, and shall trust in him...","verse_reference":"Psalm 64:10","short_text":"The righteous shall be glad...","devotional":"Joy and trust walk together in righteousness.","prayer":"Lord, I trust You and rejoice in You. Amen.","note":"Joy with trust.","mood_category":"joyful","verse_key":"joyful-ps64_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let all those that seek thee...', 'Psalm 70:4', '{"verse_text":"Let all those that seek thee rejoice and be glad in thee...","verse_reference":"Psalm 70:4","short_text":"Let all those that seek thee...","devotional":"Joy belongs to those who delight in God.","prayer":"Lord, I rejoice in You with gladness. Amen.","note":"Joy delights in God.","mood_category":"joyful","verse_key":"joyful-ps70_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou, LORD, hast made me glad...', 'Psalm 92:4', '{"verse_text":"For thou, LORD, hast made me glad through thy work...","verse_reference":"Psalm 92:4","short_text":"Thou, LORD, hast made me glad...","devotional":"God’s works inspire joyful praise.","prayer":"Lord, Your works make me glad. Amen.","note":"Joy in God’s works.","mood_category":"joyful","verse_key":"joyful-ps92_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let the heart of them rejoice...', 'Psalm 105:3', '{"verse_text":"Glory ye in his holy name: let the heart of them rejoice that seek the LORD.","verse_reference":"Psalm 105:3","short_text":"Let the heart of them rejoice...","devotional":"Seeking God brings rejoicing hearts.","prayer":"Lord, my heart rejoices as I seek You. Amen.","note":"Joy seeks God.","mood_category":"joyful","verse_key":"joyful-ps105_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let the saints be joyful...', 'Psalm 149:5', '{"verse_text":"Let the saints be joyful in glory...","verse_reference":"Psalm 149:5","short_text":"Let the saints be joyful...","devotional":"Joy belongs to God’s people.","prayer":"Lord, I rejoice in the glory You give. Amen.","note":"Joy of the saints.","mood_category":"joyful","verse_key":"joyful-ps149_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'A merry heart maketh a cheerful countenance...', 'Proverbs 15:13', '{"verse_text":"A merry heart maketh a cheerful countenance...","verse_reference":"Proverbs 15:13","short_text":"A merry heart maketh a cheerful countenance...","devotional":"Inner joy shines outwardly.","prayer":"Lord, fill my heart with joy that shows. Amen.","note":"Joy shows outwardly.","mood_category":"joyful","verse_key":"joyful-prov15_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I bring you good tidings of great joy...', 'Luke 2:10', '{"verse_text":"Fear not: for, behold, I bring you good tidings of great joy...","verse_reference":"Luke 2:10","short_text":"I bring you good tidings of great joy...","devotional":"The gospel itself is joy delivered.","prayer":"Lord, thank You for the joy of the good news. Amen.","note":"Joy announced.","mood_category":"joyful","verse_key":"joyful-luk2_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'joyful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is nigh unto them...', 'Psalm 34:18', '{"verse_text":"The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.","verse_reference":"Psalm 34:18","short_text":"The LORD is nigh unto them...","devotional":"God draws especially close to the broken and heavy-hearted — His nearness is your rescue.","prayer":"Lord, draw near to my broken heart today. Save and comfort my crushed spirit. Amen.","note":"He is nearest in brokenness.","mood_category":"sad","verse_key":"sad-ps34_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He healeth the broken in heart...', 'Psalm 147:3', '{"verse_text":"He healeth the broken in heart, and bindeth up their wounds.","verse_reference":"Psalm 147:3","short_text":"He healeth the broken in heart...","devotional":"God gently heals every wound sorrow leaves — His touch restores what feels shattered.","prayer":"Father, heal my broken heart and bind up every wound of sadness. Amen.","note":"His healing is tender.","mood_category":"sad","verse_key":"sad-ps147_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'To bind up the brokenhearted...', 'Isaiah 61:1', '{"verse_text":"The Spirit of the Lord GOD is upon me; because the LORD hath anointed me to preach good tidings unto the meek; he hath sent me to bind up the brokenhearted...","verse_reference":"Isaiah 61:1","short_text":"To bind up the brokenhearted...","devotional":"Jesus came especially for the brokenhearted — His mission is your mending.","prayer":"Lord Jesus, bind up my broken heart as You promised. Bring good tidings to my sadness. Amen.","note":"He was sent for the broken.","mood_category":"sad","verse_key":"sad-isa61_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;

-- Mood verses batch 4
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Blessed are they that mourn...', 'Matthew 5:4', '{"verse_text":"Blessed are they that mourn: for they shall be comforted.","verse_reference":"Matthew 5:4","short_text":"Blessed are they that mourn...","devotional":"Jesus blesses those who mourn — comfort is promised to your sorrow.","prayer":"Jesus, I mourn and feel heavy. Bless me with the comfort You promised. Amen.","note":"Comfort for the mourners.","mood_category":"sad","verse_key":"sad-matt5_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God shall wipe away all tears...', 'Revelation 21:4', '{"verse_text":"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain...","verse_reference":"Revelation 21:4","short_text":"God shall wipe away all tears...","devotional":"One day every tear ends — God Himself wipes them away forever.","prayer":"Father, thank You that sorrow is not forever. Wipe my tears and give hope for no more pain. Amen.","note":"Tears end in His presence.","mood_category":"sad","verse_key":"sad-rev21_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Weeping may endure for a night...', 'Psalm 30:5', '{"verse_text":"For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning.","verse_reference":"Psalm 30:5","short_text":"Weeping may endure for a night...","devotional":"Night seasons of weeping pass — joy arrives with God’s morning.","prayer":"Lord, this night of sadness feels long. Bring joy in the morning. Amen.","note":"Joy follows the night.","mood_category":"sad","verse_key":"sad-ps30_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The God of all comfort...', '2 Corinthians 1:3-4', '{"verse_text":"Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort; Who comforteth us in all our tribulation...","verse_reference":"2 Corinthians 1:3-4","short_text":"The God of all comfort...","devotional":"God is the source of every mercy and comfort — He meets you in every sorrow.","prayer":"God of all comfort, meet me in this tribulation and pour out Your mercies. Amen.","note":"Comfort from the Father.","mood_category":"sad","verse_key":"sad-2cor1_3-4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou tellest my wanderings...', 'Psalm 56:8', '{"verse_text":"Thou tellest my wanderings: put thou my tears into thy bottle: are they not in thy book?","verse_reference":"Psalm 56:8","short_text":"Thou tellest my wanderings...","devotional":"God collects every tear — your sorrow is seen, recorded, and precious to Him.","prayer":"Lord, thank You for treasuring my tears. You see every one. Amen.","note":"Tears are kept by Him.","mood_category":"sad","verse_key":"sad-ps56_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Surely he hath borne our griefs...', 'Isaiah 53:4', '{"verse_text":"Surely he hath borne our griefs, and carried our sorrows...","verse_reference":"Isaiah 53:4","short_text":"Surely he hath borne our griefs...","devotional":"Jesus carried your griefs and sorrows on the cross — you don’t bear them alone.","prayer":"Jesus, thank You for bearing my griefs and carrying my sorrows. Amen.","note":"He bore our sorrows.","mood_category":"sad","verse_key":"sad-isa53_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Why art thou cast down, O my soul...', 'Psalm 42:11', '{"verse_text":"Why art thou cast down, O my soul? and why art thou disquieted within me? hope thou in God: for I shall yet praise him...","verse_reference":"Psalm 42:11","short_text":"Why art thou cast down, O my soul...","devotional":"Speak hope to your downcast soul — praise is coming again.","prayer":"Lord, my soul is cast down. Help me hope in You and praise again. Amen.","note":"Hope lifts the downcast.","mood_category":"sad","verse_key":"sad-ps42_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Your sorrow shall be turned into joy...', 'John 16:20', '{"verse_text":"Verily, verily, I say unto you, That ye shall weep and lament, but the world shall rejoice: and ye shall be sorrowful, but your sorrow shall be turned into joy.","verse_reference":"John 16:20","short_text":"Your sorrow shall be turned into joy...","devotional":"Jesus promises sorrow turns to joy — the turning is certain.","prayer":"Jesus, my sorrow feels endless. Turn it to joy as You promised. Amen.","note":"Sorrow turns to joy.","mood_category":"sad","verse_key":"sad-jn16_20"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Yea, though I walk through the valley...', 'Psalm 23:4', '{"verse_text":"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me...","verse_reference":"Psalm 23:4","short_text":"Yea, though I walk through the valley...","devotional":"Even in the darkest valley of sadness, the Shepherd walks with you.","prayer":"Lord, in this valley of heaviness, be with me and comfort me. Amen.","note":"He walks through the valley.","mood_category":"sad","verse_key":"sad-ps23_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Come unto me, all ye that labour...', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour...","devotional":"Jesus invites the heavy-hearted to rest in Him — lay down your burden.","prayer":"Jesus, I am heavy laden with sadness. Give me rest in You. Amen.","note":"Rest for the heavy.","mood_category":"sad","verse_key":"sad-matt11_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Therefore is my spirit overwhelmed...', 'Psalm 143:4', '{"verse_text":"Therefore is my spirit overwhelmed within me; my heart within me is desolate.","verse_reference":"Psalm 143:4","short_text":"Therefore is my spirit overwhelmed...","devotional":"When your spirit feels overwhelmed and desolate, God understands.","prayer":"Father, my spirit is overwhelmed. Understand my desolation and help me. Amen.","note":"He knows the overwhelmed.","mood_category":"sad","verse_key":"sad-ps143_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fear thou not; for I am with thee...', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God...","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"God’s presence banishes fear in sorrow — He strengthens and upholds.","prayer":"Lord, I am dismayed and sad. Strengthen and uphold me. Amen.","note":"No fear with Him near.","mood_category":"sad","verse_key":"sad-isa41_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Cast thy burden upon the LORD...', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee...","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"Give God your heavy burden — He sustains when you can’t carry on.","prayer":"Lord, I cast my heavy burden on You. Sustain me today. Amen.","note":"He sustains the burdened.","mood_category":"sad","verse_key":"sad-ps55_22"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Casting all your care upon him...', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him...","devotional":"Every care and sadness is safe with Him — because He cares deeply.","prayer":"Father, I cast all my sadness on You. You care for me. Amen.","note":"He cares deeply.","mood_category":"sad","verse_key":"sad-1pet5_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When my heart is overwhelmed...', 'Psalm 61:2', '{"verse_text":"From the end of the earth will I cry unto thee, when my heart is overwhelmed: lead me to the rock that is higher than I.","verse_reference":"Psalm 61:2","short_text":"When my heart is overwhelmed...","devotional":"Cry out when overwhelmed — God leads to higher ground.","prayer":"Lord, my heart is overwhelmed. Lead me to the Rock higher than I. Amen.","note":"Higher ground in Him.","mood_category":"sad","verse_key":"sad-ps61_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For the Lord will not cast off...', 'Lamentations 3:31-32', '{"verse_text":"For the Lord will not cast off for ever: But though he cause grief, yet will he have compassion according to the multitude of his mercies.","verse_reference":"Lamentations 3:31-32","short_text":"For the Lord will not cast off...","devotional":"Grief is not forever — God’s compassion returns in mercy.","prayer":"Lord, though grief lingers, have compassion on me according to Your mercies. Amen.","note":"Mercy after grief.","mood_category":"sad","verse_key":"sad-lam3_31-32"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My soul melteth for heaviness...', 'Psalm 119:28', '{"verse_text":"My soul melteth for heaviness: strengthen thou me according unto thy word.","verse_reference":"Psalm 119:28","short_text":"My soul melteth for heaviness...","devotional":"When your soul melts with heaviness, God’s Word strengthens.","prayer":"Father, my soul melts with heaviness. Strengthen me by Your Word. Amen.","note":"Strength from His Word.","mood_category":"sad","verse_key":"sad-ps119_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For our light affliction...', '2 Corinthians 4:16-18', '{"verse_text":"For our light affliction, which is but for a moment, worketh for us a far more exceeding and eternal weight of glory...","verse_reference":"2 Corinthians 4:16-18","short_text":"For our light affliction...","devotional":"Earthly sadness is momentary — eternal glory outweighs it.","prayer":"Lord, help me see this affliction as light and momentary. Fix my eyes on eternal glory. Amen.","note":"Glory outweighs sorrow.","mood_category":"sad","verse_key":"sad-2cor4_16-18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My flesh and my heart faileth...', 'Psalm 73:26', '{"verse_text":"My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.","verse_reference":"Psalm 73:26","short_text":"My flesh and my heart faileth...","devotional":"When heart and strength fail, God remains your eternal portion.","prayer":"Lord, when my heart fails, be my strength and portion forever. Amen.","note":"He is your portion.","mood_category":"sad","verse_key":"sad-ps73_26"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Peace I leave with you...', 'John 14:27', '{"verse_text":"Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.","verse_reference":"John 14:27","short_text":"Peace I leave with you...","devotional":"Jesus gives His own peace — not like the world’s fleeting kind.","prayer":"Jesus, leave Your peace with me. Calm my troubled heart. Amen.","note":"His peace endures.","mood_category":"sad","verse_key":"sad-jn14_27"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Cause me to hear thy lovingkindness...', 'Psalm 143:8', '{"verse_text":"Cause me to hear thy lovingkindness in the morning; for in thee do I trust: cause me to know the way wherein I should walk...","verse_reference":"Psalm 143:8","short_text":"Cause me to hear thy lovingkindness...","devotional":"In morning sorrow, ask to hear God’s lovingkindness anew.","prayer":"Lord, let me hear Your lovingkindness this morning. Guide my steps. Amen.","note":"Lovingkindness in the morning.","mood_category":"sad","verse_key":"sad-ps143_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'They that wait upon the LORD...', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles...","verse_reference":"Isaiah 40:31","short_text":"They that wait upon the LORD...","devotional":"Wait on God — strength renews, and you rise above heaviness.","prayer":"Father, as I wait on You, renew my strength and lift me up. Amen.","note":"Renewed strength awaits.","mood_category":"sad","verse_key":"sad-isa40_31"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I had fainted, unless I had believed...', 'Psalm 27:13-14', '{"verse_text":"I had fainted, unless I had believed to see the goodness of the LORD in the land of the living. Wait on the LORD: be of good courage...","verse_reference":"Psalm 27:13-14","short_text":"I had fainted, unless I had believed...","devotional":"Believing in God’s goodness keeps you from fainting — wait with courage.","prayer":"Lord, help me believe in Your goodness. Give me courage to wait. Amen.","note":"Goodness in the land of living.","mood_category":"sad","verse_key":"sad-ps27_13-14"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For I reckon that the sufferings...', 'Romans 8:18', '{"verse_text":"For I reckon that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us.","verse_reference":"Romans 8:18","short_text":"For I reckon that the sufferings...","devotional":"Present sadness pales against future glory — hold on.","prayer":"Father, help me see that these sufferings are not worthy compared to the glory ahead. Amen.","note":"Glory outweighs suffering.","mood_category":"sad","verse_key":"sad-rom8_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God is our refuge and strength...', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength...","devotional":"In heavy trouble, God is your immediate refuge and strength.","prayer":"Lord, be my refuge and strength in this trouble. Be present with me. Amen.","note":"Very present help.","mood_category":"sad","verse_key":"sad-ps46_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Notwithstanding the Lord stood with me...', '2 Timothy 4:17', '{"verse_text":"Notwithstanding the Lord stood with me, and strengthened me...","verse_reference":"2 Timothy 4:17","short_text":"Notwithstanding the Lord stood with me...","devotional":"Even when others forsake, the Lord stands with you and strengthens.","prayer":"Lord, stand with me and strengthen me when I feel alone in sorrow. Amen.","note":"He stands when others leave.","mood_category":"sad","verse_key":"sad-2tim4_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD also will be a refuge...', 'Psalm 9:9', '{"verse_text":"The LORD also will be a refuge for the oppressed, a refuge in times of trouble.","verse_reference":"Psalm 9:9","short_text":"The LORD also will be a refuge...","devotional":"God is refuge for the oppressed and sad — run to Him.","prayer":"Lord, be my refuge in this time of heaviness. Amen.","note":"Refuge for the oppressed.","mood_category":"sad","verse_key":"sad-ps9_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Turn thee unto me...', 'Psalm 25:16-17', '{"verse_text":"Turn thee unto me, and have mercy upon me; for I am desolate and afflicted. The troubles of my heart are enlarged...","verse_reference":"Psalm 25:16-17","short_text":"Turn thee unto me...","devotional":"Cry out in desolation — God turns with mercy.","prayer":"Lord, turn to me in my desolation. Have mercy on my enlarged troubles. Amen.","note":"Mercy for the desolate.","mood_category":"sad","verse_key":"sad-ps25_16-17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Hear my prayer, O LORD...', 'Psalm 102:1-2', '{"verse_text":"Hear my prayer, O LORD, and let my cry come unto thee. Hide not thy face from me in the day when I am in trouble...","verse_reference":"Psalm 102:1-2","short_text":"Hear my prayer, O LORD...","devotional":"Your cry reaches God — He does not hide in trouble.","prayer":"Father, hear my prayer and cry. Do not hide Your face from my trouble. Amen.","note":"Your cry is heard.","mood_category":"sad","verse_key":"sad-ps102_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For the mountains shall depart...', 'Isaiah 54:10', '{"verse_text":"For the mountains shall depart, and the hills be removed; but my kindness shall not depart from thee...","verse_reference":"Isaiah 54:10","short_text":"For the mountains shall depart...","devotional":"God’s kindness outlasts everything — even sorrow.","prayer":"Lord, Your kindness never departs from me. Hold me in it. Amen.","note":"Kindness eternal.","mood_category":"sad","verse_key":"sad-isa54_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For he hath not despised...', 'Psalm 22:24', '{"verse_text":"For he hath not despised nor abhorred the affliction of the afflicted; neither hath he hid his face from him; but when he cried unto him, he heard.","verse_reference":"Psalm 22:24","short_text":"For he hath not despised...","devotional":"God never despises your affliction — He hears every cry.","prayer":"Lord, thank You for not despising my affliction. You hear me. Amen.","note":"He hears the afflicted.","mood_category":"sad","verse_key":"sad-ps22_24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD heareth the poor...', 'Psalm 69:33', '{"verse_text":"For the LORD heareth the poor, and despiseth not his prisoners.","verse_reference":"Psalm 69:33","short_text":"The LORD heareth the poor...","devotional":"God hears the poor in spirit — He never despises.","prayer":"Lord, hear me in my poverty of spirit. I am not despised. Amen.","note":"He hears the poor.","mood_category":"sad","verse_key":"sad-ps69_33"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will be glad and rejoice...', 'Psalm 31:7', '{"verse_text":"I will be glad and rejoice in thy mercy: for thou hast considered my trouble; thou hast known my soul in adversities;","verse_reference":"Psalm 31:7","short_text":"I will be glad and rejoice...","devotional":"God knows your soul in adversity — His mercy brings gladness.","prayer":"Lord, consider my trouble and know my soul. Let mercy make me glad. Amen.","note":"He knows in adversity.","mood_category":"sad","verse_key":"sad-ps31_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Have mercy upon me, O LORD...', 'Psalm 6:2-3', '{"verse_text":"Have mercy upon me, O LORD; for I am weak: O LORD, heal me; for my bones are vexed. My soul is also sore vexed...","verse_reference":"Psalm 6:2-3","short_text":"Have mercy upon me, O LORD...","devotional":"Cry for mercy in weakness — God heals the vexed soul.","prayer":"Lord, have mercy on my weakness. Heal my vexed soul. Amen.","note":"Mercy for the weak.","mood_category":"sad","verse_key":"sad-ps6_2-3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Hear me speedily, O LORD...', 'Psalm 143:7', '{"verse_text":"Hear me speedily, O LORD: my spirit faileth: hide not thy face from me...","verse_reference":"Psalm 143:7","short_text":"Hear me speedily, O LORD...","devotional":"When your spirit fails, ask God to hear speedily.","prayer":"Lord, my spirit fails — hear me speedily and do not hide. Amen.","note":"Speedy hearing.","mood_category":"sad","verse_key":"sad-ps143_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I cried unto God with my voice...', 'Psalm 77:1-2', '{"verse_text":"I cried unto God with my voice, even unto God with my voice; and he gave ear unto me. In the day of my trouble I sought the Lord...","verse_reference":"Psalm 77:1-2","short_text":"I cried unto God with my voice...","devotional":"In trouble, cry to God — He gives ear.","prayer":"Lord, I cry to You in trouble. Give ear to me. Amen.","note":"He gives ear.","mood_category":"sad","verse_key":"sad-ps77_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O LORD God of my salvation...', 'Psalm 88:1-2', '{"verse_text":"O LORD God of my salvation, I have cried day and night before thee: Let my prayer come before thee: incline thine ear unto my cry;","verse_reference":"Psalm 88:1-2","short_text":"O LORD God of my salvation...","devotional":"Persistent crying day and night — God inclines His ear.","prayer":"Lord God of my salvation, hear my day-and-night cry. Incline Your ear. Amen.","note":"He inclines His ear.","mood_category":"sad","verse_key":"sad-ps88_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Sorrow is better than laughter...', 'Ecclesiastes 7:3', '{"verse_text":"Sorrow is better than laughter: for by the sadness of the countenance the heart is made better.","verse_reference":"Ecclesiastes 7:3","short_text":"Sorrow is better than laughter...","devotional":"God uses sorrow to make the heart better — deeper wisdom.","prayer":"Father, use this sorrow to make my heart better. Amen.","note":"Sorrow refines.","mood_category":"sad","verse_key":"sad-eccl7_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Tribulation worketh patience...', 'Romans 5:3-5', '{"verse_text":"And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; And patience, experience; and experience, hope...","verse_reference":"Romans 5:3-5","short_text":"Tribulation worketh patience...","devotional":"Tribulation produces patience, character, and hope — sorrow has purpose.","prayer":"Lord, help me glory in tribulation, knowing it works hope in me. Amen.","note":"Hope through tribulation.","mood_category":"sad","verse_key":"sad-rom5_3-5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Count it all joy...', 'James 1:2-3', '{"verse_text":"My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience.","verse_reference":"James 1:2-3","short_text":"Count it all joy...","devotional":"Trials produce patience — count it joy in the process.","prayer":"Lord, help me count sorrow as joy, knowing it works patience. Amen.","note":"Joy in trials.","mood_category":"sad","verse_key":"sad-jas1_2-3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Wherein ye greatly rejoice...', '1 Peter 1:6-7', '{"verse_text":"Wherein ye greatly rejoice, though now for a season, if need be, ye are in heaviness through manifold temptations: That the trial of your faith...","verse_reference":"1 Peter 1:6-7","short_text":"Wherein ye greatly rejoice...","devotional":"Heaviness is for a season — faith refined is precious.","prayer":"Father, though heaviness comes, refine my faith as gold. Amen.","note":"Season of heaviness.","mood_category":"sad","verse_key":"sad-1pet1_6-7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'They that sow in tears...', 'Psalm 126:5-6', '{"verse_text":"They that sow in tears shall reap in joy. He that goeth forth and weepeth, bearing precious seed, shall doubtless come again with rejoicing...","verse_reference":"Psalm 126:5-6","short_text":"They that sow in tears...","devotional":"Tears sown today bring joyful harvest tomorrow.","prayer":"Lord, I sow in tears. Bring me back with joy. Amen.","note":"Harvest from tears.","mood_category":"sad","verse_key":"sad-ps126_5-6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The ransomed of the LORD...', 'Isaiah 35:10', '{"verse_text":"And the ransomed of the LORD shall return, and come to Zion with songs and everlasting joy upon their heads: they shall obtain joy and gladness, and sorrow and sighing shall flee away.","verse_reference":"Isaiah 35:10","short_text":"The ransomed of the LORD...","devotional":"Sorrow and sighing flee — everlasting joy awaits.","prayer":"Lord, let sorrow flee and everlasting joy come. Amen.","note":"Joy everlasting.","mood_category":"sad","verse_key":"sad-isa35_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the multitude of my thoughts...', 'Psalm 94:19', '{"verse_text":"In the multitude of my thoughts within me thy comforts delight my soul.","verse_reference":"Psalm 94:19","short_text":"In the multitude of my thoughts...","devotional":"When thoughts multiply in sadness, God’s comforts delight.","prayer":"Lord, in my many thoughts, let Your comforts delight my soul. Amen.","note":"Comforts delight.","mood_category":"sad","verse_key":"sad-ps94_19"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Search me, O God...', 'Psalm 139:23-24', '{"verse_text":"Search me, O God, and know my heart: try me, and know my thoughts: And see if there be any wicked way in me...","verse_reference":"Psalm 139:23-24","short_text":"Search me, O God...","devotional":"In heaviness, invite God’s search — He leads to better paths.","prayer":"God, search my heart in sadness. Lead me in the everlasting way. Amen.","note":"He leads through search.","mood_category":"sad","verse_key":"sad-ps139_23-24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The sacrifices of God are a broken spirit...', 'Psalm 51:17', '{"verse_text":"The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.","verse_reference":"Psalm 51:17","short_text":"The sacrifices of God are a broken spirit...","devotional":"A broken heart is a sacrifice God never despises.","prayer":"Lord, I offer my broken and contrite heart. Receive it. Amen.","note":"Broken heart accepted.","mood_category":"sad","verse_key":"sad-ps51_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD taketh pleasure...', 'Psalm 147:11', '{"verse_text":"The LORD taketh pleasure in them that fear him, in those that hope in his mercy.","verse_reference":"Psalm 147:11","short_text":"The LORD taketh pleasure...","devotional":"God delights in those who hope in His mercy — even in sadness.","prayer":"Lord, I hope in Your mercy. Take pleasure in me today. Amen.","note":"He delights in hope.","mood_category":"sad","verse_key":"sad-ps147_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'sad', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In every thing give thanks...', '1 Thessalonians 5:18', '{"verse_text":"In every thing give thanks: for this is the will of God in Christ Jesus concerning you.","verse_reference":"1 Thessalonians 5:18","short_text":"In every thing give thanks...","devotional":"Gratitude in all circumstances aligns with God’s will — it transforms the ordinary.","prayer":"Lord, teach me to give thanks in everything. Align my heart with Your will. Amen.","note":"Thanks in all things.","mood_category":"grateful","verse_key":"grateful-1thess5_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Enter into his gates with thanksgiving...', 'Psalm 100:4', '{"verse_text":"Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.","verse_reference":"Psalm 100:4","short_text":"Enter into his gates with thanksgiving...","devotional":"Approach God with a thankful heart — it opens the way to His presence.","prayer":"Father, I enter Your gates with thanksgiving. Bless Your name today. Amen.","note":"Thanksgiving opens gates.","mood_category":"grateful","verse_key":"grateful-ps100_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', 'Psalm 107:1', '{"verse_text":"O give thanks unto the LORD, for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 107:1","short_text":"O give thanks unto the LORD...","devotional":"God’s enduring mercy calls for endless thanks — His goodness never fails.","prayer":"Lord, thank You for Your goodness and enduring mercy. Amen.","note":"Thanks for enduring mercy.","mood_category":"grateful","verse_key":"grateful-ps107_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;

-- Mood verses batch 5
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Giving thanks always for all things...', 'Ephesians 5:20', '{"verse_text":"Giving thanks always for all things unto God and the Father in the name of our Lord Jesus Christ;","verse_reference":"Ephesians 5:20","short_text":"Giving thanks always for all things...","devotional":"Thank God for all things — gratitude honors Him through Jesus.","prayer":"Father, I give thanks always for all things in Jesus’ name. Amen.","note":"Thanks for all things.","mood_category":"grateful","verse_key":"grateful-eph5_20"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And whatsoever ye do...', 'Colossians 3:17', '{"verse_text":"And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God and the Father by him.","verse_reference":"Colossians 3:17","short_text":"And whatsoever ye do...","devotional":"Let every action overflow with thanks — done in Jesus’ name.","prayer":"Lord, in all I do, I give thanks to You through Jesus. Amen.","note":"Thanks in every deed.","mood_category":"grateful","verse_key":"grateful-col3_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', 'Psalm 136:1', '{"verse_text":"O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 136:1","short_text":"O give thanks unto the LORD...","devotional":"Repeat thanks for God’s goodness — His mercy is forever.","prayer":"Father, thank You for Your goodness; Your mercy endures forever. Amen.","note":"Mercy calls for thanks.","mood_category":"grateful","verse_key":"grateful-ps136_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be careful for nothing...', 'Philippians 4:6', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.","verse_reference":"Philippians 4:6","short_text":"Be careful for nothing...","devotional":"Pair prayer with thanksgiving — it guards against worry.","prayer":"Lord, in prayer and supplication, I thank You as I make my requests. Amen.","note":"Thanks with prayer.","mood_category":"grateful","verse_key":"grateful-phil4_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'By him therefore let us offer...', 'Hebrews 13:15', '{"verse_text":"By him therefore let us offer the sacrifice of praise to God continually, that is, the fruit of our lips giving thanks to his name.","verse_reference":"Hebrews 13:15","short_text":"By him therefore let us offer...","devotional":"Praise is a sacrifice of thanks — offer it continually.","prayer":"Jesus, through You I offer the sacrifice of praise and thanks. Amen.","note":"Sacrifice of praise.","mood_category":"grateful","verse_key":"grateful-heb13_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'This is the day which the LORD hath made...', 'Psalm 118:24', '{"verse_text":"This is the day which the LORD hath made; we will rejoice and be glad in it.","verse_reference":"Psalm 118:24","short_text":"This is the day which the LORD hath made...","devotional":"Every day is God’s gift — rejoice with gratitude.","prayer":"Lord, thank You for this day You made. I rejoice in it. Amen.","note":"Thanks for today.","mood_category":"grateful","verse_key":"grateful-ps118_24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And let the peace of God rule...', 'Colossians 3:15', '{"verse_text":"And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.","verse_reference":"Colossians 3:15","short_text":"And let the peace of God rule...","devotional":"God’s peace rules in thankful hearts — embrace it.","prayer":"Father, let Your peace rule in my heart as I remain thankful. Amen.","note":"Thankful for peace.","mood_category":"grateful","verse_key":"grateful-col3_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Whoso offereth praise glorifieth me...', 'Psalm 50:23', '{"verse_text":"Whoso offereth praise glorifieth me: and to him that ordereth his conversation aright will I shew the salvation of God.","verse_reference":"Psalm 50:23","short_text":"Whoso offereth praise glorifieth me...","devotional":"Offering praise glorifies God — it reveals His salvation.","prayer":"Lord, I offer praise to glorify You. Show me Your salvation. Amen.","note":"Praise glorifies.","mood_category":"grateful","verse_key":"grateful-ps50_23"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'It is a good thing to give thanks...', 'Psalm 92:1', '{"verse_text":"It is a good thing to give thanks unto the LORD, and to sing praises unto thy name, O most High:","verse_reference":"Psalm 92:1","short_text":"It is a good thing to give thanks...","devotional":"Giving thanks is good — it sings praise to the Most High.","prayer":"Lord, it is good to thank You and sing Your praises. Amen.","note":"Thanks is good.","mood_category":"grateful","verse_key":"grateful-ps92_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let us come before his presence...', 'Psalm 95:2', '{"verse_text":"Let us come before his presence with thanksgiving, and make a joyful noise unto him with psalms.","verse_reference":"Psalm 95:2","short_text":"Let us come before his presence...","devotional":"Enter His presence with thanks and joyful noise.","prayer":"Father, I come before You with thanksgiving and joyful psalms. Amen.","note":"Thanks in presence.","mood_category":"grateful","verse_key":"grateful-ps95_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Bless the LORD, O my soul...', 'Psalm 103:1-2', '{"verse_text":"Bless the LORD, O my soul: and all that is within me, bless his holy name. Bless the LORD, O my soul, and forget not all his benefits:","verse_reference":"Psalm 103:1-2","short_text":"Bless the LORD, O my soul...","devotional":"Bless God with your whole soul — remember every benefit.","prayer":"Lord, my soul blesses You. I forget not Your benefits. Amen.","note":"Bless with all within.","mood_category":"grateful","verse_key":"grateful-ps103_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the God of heaven...', 'Psalm 136:26', '{"verse_text":"O give thanks unto the God of heaven: for his mercy endureth for ever.","verse_reference":"Psalm 136:26","short_text":"O give thanks unto the God of heaven...","devotional":"Thank the God of heaven — His mercy is forever.","prayer":"God of heaven, thank You for Your enduring mercy. Amen.","note":"Thanks to heaven’s God.","mood_category":"grateful","verse_key":"grateful-ps136_26"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Praise ye the LORD...', 'Psalm 106:1', '{"verse_text":"Praise ye the LORD. O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 106:1","short_text":"Praise ye the LORD...","devotional":"Praise begins with thanks — for His goodness and mercy.","prayer":"Lord, I praise and thank You for Your goodness. Amen.","note":"Praise with thanks.","mood_category":"grateful","verse_key":"grateful-ps106_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', 'Psalm 118:1', '{"verse_text":"O give thanks unto the LORD; for he is good: because his mercy endureth for ever.","verse_reference":"Psalm 118:1","short_text":"O give thanks unto the LORD...","devotional":"Thanks flows from God’s goodness and endless mercy.","prayer":"Father, thank You for Your goodness and mercy forever. Amen.","note":"Goodness deserves thanks.","mood_category":"grateful","verse_key":"grateful-ps118_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', 'Psalm 118:29', '{"verse_text":"O give thanks unto the LORD; for he is good: for his mercy endureth for ever.","verse_reference":"Psalm 118:29","short_text":"O give thanks unto the LORD...","devotional":"End and begin with thanks — His mercy endures.","prayer":"Lord, thank You again for Your enduring mercy. Amen.","note":"Thanks bookends praise.","mood_category":"grateful","verse_key":"grateful-ps118_29"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will praise the LORD...', 'Psalm 7:17', '{"verse_text":"I will praise the LORD according to his righteousness: and will sing praise to the name of the LORD most high.","verse_reference":"Psalm 7:17","short_text":"I will praise the LORD...","devotional":"Praise God for His righteousness — sing thanks to the Most High.","prayer":"Lord, I praise Your righteousness and sing to Your name. Amen.","note":"Praise for righteousness.","mood_category":"grateful","verse_key":"grateful-ps7_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Sing unto the LORD, O ye saints...', 'Psalm 30:4', '{"verse_text":"Sing unto the LORD, O ye saints of his, and give thanks at the remembrance of his holiness.","verse_reference":"Psalm 30:4","short_text":"Sing unto the LORD, O ye saints...","devotional":"Sing thanks remembering God’s holiness — as His saints.","prayer":"Lord, I sing thanks remembering Your holiness. Amen.","note":"Thanks for holiness.","mood_category":"grateful","verse_key":"grateful-ps30_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will offer to thee the sacrifice...', 'Psalm 116:17', '{"verse_text":"I will offer to thee the sacrifice of thanksgiving, and will call upon the name of the LORD.","verse_reference":"Psalm 116:17","short_text":"I will offer to thee the sacrifice...","devotional":"Thanksgiving is a sacrifice — offer it and call on Him.","prayer":"Father, I offer the sacrifice of thanksgiving and call on You. Amen.","note":"Sacrifice of thanks.","mood_category":"grateful","verse_key":"grateful-ps116_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Sing unto the LORD with thanksgiving...', 'Psalm 147:7', '{"verse_text":"Sing unto the LORD with thanksgiving; sing praise upon the harp unto our God:","verse_reference":"Psalm 147:7","short_text":"Sing unto the LORD with thanksgiving...","devotional":"Sing thanks with praise — music honors God.","prayer":"Lord, I sing to You with thanksgiving and praise. Amen.","note":"Thanks in song.","mood_category":"grateful","verse_key":"grateful-ps147_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Make a joyful noise unto the LORD...', 'Psalm 100:1-5', '{"verse_text":"Make a joyful noise unto the LORD, all ye lands. Serve the LORD with gladness: come before his presence with singing. Know ye that the LORD he is God: it is he that hath made us, and not we ourselves; we are his people, and the sheep of his pasture. Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name. For the LORD is good; his mercy is everlasting; and his truth endureth to all generations.","verse_reference":"Psalm 100:1-5","short_text":"Make a joyful noise unto the LORD...","devotional":"The whole earth thanks God — for He is good and merciful.","prayer":"Lord, I make joyful noise and enter with thanks. Amen.","note":"Joyful thanks universal.","mood_category":"grateful","verse_key":"grateful-ps100_1-5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Bless the LORD, O my soul...', 'Psalm 103:2', '{"verse_text":"Bless the LORD, O my soul, and forget not all his benefits:","verse_reference":"Psalm 103:2","short_text":"Bless the LORD, O my soul...","devotional":"Don’t forget God’s benefits — bless Him with gratitude.","prayer":"Father, I bless You and forget not Your benefits. Amen.","note":"Remember benefits.","mood_category":"grateful","verse_key":"grateful-ps103_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD gave, and the LORD hath taken away...', 'Job 1:21', '{"verse_text":"And said, Naked came I out of my mother''s womb, and naked shall I return thither: the LORD gave, and the LORD hath taken away; blessed be the name of the LORD.","verse_reference":"Job 1:21","short_text":"The LORD gave, and the LORD hath taken away...","devotional":"Bless God in giving and taking — gratitude endures.","prayer":"Lord, You give and take; blessed be Your name. Amen.","note":"Blessed in all seasons.","mood_category":"grateful","verse_key":"grateful-job1_21"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Then Hezekiah answered and said...', '2 Chronicles 29:31', '{"verse_text":"Then Hezekiah answered and said, Now ye have consecrated yourselves unto the LORD, come near and bring sacrifices and thank offerings into the house of the LORD...","verse_reference":"2 Chronicles 29:31","short_text":"Then Hezekiah answered and said...","devotional":"Consecration leads to thank offerings — draw near.","prayer":"Lord, as I consecrate myself, I bring thank offerings to You. Amen.","note":"Thanks in consecration.","mood_category":"grateful","verse_key":"grateful-2chr29_31"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When thou hast eaten and art full...', 'Deuteronomy 8:10', '{"verse_text":"When thou hast eaten and art full, then thou shalt bless the LORD thy God for the good land which he hath given thee.","verse_reference":"Deuteronomy 8:10","short_text":"When thou hast eaten and art full...","devotional":"Bless God for provision — when full, give thanks.","prayer":"Father, thank You for filling me; I bless You for Your gifts. Amen.","note":"Thanks after eating.","mood_category":"grateful","verse_key":"grateful-deut8_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is my strength and my shield...', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him.","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength and my shield...","devotional":"Rejoice and praise for God’s help and strength.","prayer":"Lord, thank You for being my strength; I praise with song. Amen.","note":"Praise for help.","mood_category":"grateful","verse_key":"grateful-ps28_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Make a joyful noise unto God...', 'Psalm 66:1', '{"verse_text":"Make a joyful noise unto God, all ye lands:","verse_reference":"Psalm 66:1","short_text":"Make a joyful noise unto God...","devotional":"All lands give joyful thanks to God.","prayer":"Father, I make joyful noise in thanks to You. Amen.","note":"Global joyful noise.","mood_category":"grateful","verse_key":"grateful-ps66_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Let every thing that hath breath...', 'Psalm 150:6', '{"verse_text":"Let every thing that hath breath praise the LORD. Praise ye the LORD.","verse_reference":"Psalm 150:6","short_text":"Let every thing that hath breath...","devotional":"Every breath is for praise — thanks in living.","prayer":"Lord, with every breath I praise and thank You. Amen.","note":"Breath for praise.","mood_category":"grateful","verse_key":"grateful-ps150_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Cease not to give thanks for you...', 'Ephesians 1:16', '{"verse_text":"Cease not to give thanks for you, making mention of you in my prayers;","verse_reference":"Ephesians 1:16","short_text":"Cease not to give thanks for you...","devotional":"Give ceaseless thanks for others in prayer.","prayer":"Father, I cease not to thank You for those in my life. Amen.","note":"Thanks in prayer.","mood_category":"grateful","verse_key":"grateful-eph1_16"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Continue in prayer...', 'Colossians 4:2', '{"verse_text":"Continue in prayer, and watch in the same with thanksgiving;","verse_reference":"Colossians 4:2","short_text":"Continue in prayer...","devotional":"Watch in prayer with thanks — steadfast gratitude.","prayer":"Lord, help me continue in prayer with thanksgiving. Amen.","note":"Thanks watchful.","mood_category":"grateful","verse_key":"grateful-col4_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', '1 Chronicles 16:34', '{"verse_text":"O give thanks unto the LORD; for he is good; for his mercy endureth for ever.","verse_reference":"1 Chronicles 16:34","short_text":"O give thanks unto the LORD...","devotional":"Thanks for God’s goodness and endless mercy.","prayer":"Father, thank You for Your goodness and mercy. Amen.","note":"Goodness and mercy.","mood_category":"grateful","verse_key":"grateful-1chr16_34"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thanks be unto God for his unspeakable gift.', '2 Corinthians 9:15', '{"verse_text":"Thanks be unto God for his unspeakable gift.","verse_reference":"2 Corinthians 9:15","short_text":"Thanks be unto God for his unspeakable gift.","devotional":"Thanks for God’s indescribable gift — Jesus.","prayer":"Lord, thanks for Your unspeakable gift. Amen.","note":"Unspeakable gift.","mood_category":"grateful","verse_key":"grateful-2cor9_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'O give thanks unto the LORD...', 'Psalm 105:1', '{"verse_text":"O give thanks unto the LORD; call upon his name: make known his deeds among the people.","verse_reference":"Psalm 105:1","short_text":"O give thanks unto the LORD...","devotional":"Thanks leads to proclaiming God’s deeds.","prayer":"Lord, thank You; I make known Your deeds. Amen.","note":"Proclaim with thanks.","mood_category":"grateful","verse_key":"grateful-ps105_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will praise the name of God with a song...', 'Psalm 69:30', '{"verse_text":"I will praise the name of God with a song, and will magnify him with thanksgiving.","verse_reference":"Psalm 69:30","short_text":"I will praise the name of God with a song...","devotional":"Magnify God with thanksgiving and song.","prayer":"Father, I praise Your name with song and thanks. Amen.","note":"Magnify with thanks.","mood_category":"grateful","verse_key":"grateful-ps69_30"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will give thee thanks in the great congregation...', 'Psalm 35:18', '{"verse_text":"I will give thee thanks in the great congregation: I will praise thee among much people.","verse_reference":"Psalm 35:18","short_text":"I will give thee thanks in the great congregation...","devotional":"Give thanks publicly — among the people.","prayer":"Lord, I thank You in the congregation and praise You. Amen.","note":"Public thanks.","mood_category":"grateful","verse_key":"grateful-ps35_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'If he offer it for a thanksgiving...', 'Leviticus 7:12', '{"verse_text":"If he offer it for a thanksgiving, then he shall offer with the sacrifice of thanksgiving unleavened cakes mingled with oil...","verse_reference":"Leviticus 7:12","short_text":"If he offer it for a thanksgiving...","devotional":"Thank offerings honor God’s provision.","prayer":"Father, I offer thanks as a sacrifice to You. Amen.","note":"Thank offering.","mood_category":"grateful","verse_key":"grateful-lev7_12"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'What shall I render unto the LORD...', 'Psalm 116:12', '{"verse_text":"What shall I render unto the LORD for all his benefits toward me?","verse_reference":"Psalm 116:12","short_text":"What shall I render unto the LORD...","devotional":"Respond to benefits with grateful rendering.","prayer":"Lord, what can I render for all Your benefits? I thank You. Amen.","note":"Render thanks.","mood_category":"grateful","verse_key":"grateful-ps116_12"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'But I will sacrifice unto thee...', 'Jonah 2:9', '{"verse_text":"But I will sacrifice unto thee with the voice of thanksgiving; I will pay that that I have vowed. Salvation is of the LORD.","verse_reference":"Jonah 2:9","short_text":"But I will sacrifice unto thee...","devotional":"Sacrifice with voice of thanks — salvation is His.","prayer":"Lord, I sacrifice with thanksgiving; salvation is Yours. Amen.","note":"Voice of thanks.","mood_category":"grateful","verse_key":"grateful-jon2_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Offer a sacrifice of thanksgiving...', 'Amos 4:5', '{"verse_text":"And offer a sacrifice of thanksgiving with leaven, and proclaim and publish the free offerings: for this liketh you, O ye children of Israel, saith the Lord GOD.","verse_reference":"Amos 4:5","short_text":"Offer a sacrifice of thanksgiving...","devotional":"Offer thanks as a free sacrifice.","prayer":"Father, I offer thanksgiving as my sacrifice. Amen.","note":"Free thanks.","mood_category":"grateful","verse_key":"grateful-amos4_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Therefore will I give thanks unto thee...', 'Psalm 18:49', '{"verse_text":"Therefore will I give thanks unto thee, O LORD, among the heathen, and sing praises unto thy name.","verse_reference":"Psalm 18:49","short_text":"Therefore will I give thanks unto thee...","devotional":"Give thanks among all — sing His praises.","prayer":"Lord, I give thanks among all and sing to You. Amen.","note":"Thanks among nations.","mood_category":"grateful","verse_key":"grateful-ps18_49"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'First, I thank my God through Jesus Christ...', 'Romans 1:8', '{"verse_text":"First, I thank my God through Jesus Christ for you all, that your faith is spoken of throughout the whole world.","verse_reference":"Romans 1:8","short_text":"First, I thank my God through Jesus Christ...","devotional":"Thank God for others’ faith — it spreads.","prayer":"Father, thank You for the faith of others through Jesus. Amen.","note":"Thanks for faith.","mood_category":"grateful","verse_key":"grateful-rom1_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I thank my God always on your behalf...', '1 Corinthians 1:4', '{"verse_text":"I thank my God always on your behalf, for the grace of God which is given you by Jesus Christ;","verse_reference":"1 Corinthians 1:4","short_text":"I thank my God always on your behalf...","devotional":"Thanks for God’s grace given to others.","prayer":"Lord, thank You for Your grace given through Christ. Amen.","note":"Grace deserves thanks.","mood_category":"grateful","verse_key":"grateful-1cor1_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'We are bound to thank God always for you...', '2 Thessalonians 1:3', '{"verse_text":"We are bound to thank God always for you, brethren, as it is meet, because that your faith groweth exceedingly...","verse_reference":"2 Thessalonians 1:3","short_text":"We are bound to thank God always for you...","devotional":"Thank God for growing faith in believers.","prayer":"Father, thank You for growing faith in Your people. Amen.","note":"Thanks for growth.","mood_category":"grateful","verse_key":"grateful-2thess1_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'So we thy people and sheep of thy pasture...', 'Psalm 79:13', '{"verse_text":"So we thy people and sheep of thy pasture will give thee thanks for ever: we will shew forth thy praise to all generations.","verse_reference":"Psalm 79:13","short_text":"So we thy people and sheep of thy pasture...","devotional":"As His sheep, give eternal thanks and praise.","prayer":"Lord, as Your sheep, I thank You forever. Amen.","note":"Eternal thanks.","mood_category":"grateful","verse_key":"grateful-ps79_13"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Unto thee, O God, do we give thanks...', 'Psalm 75:1', '{"verse_text":"Unto thee, O God, do we give thanks, unto thee do we give thanks: for that thy name is near thy wondrous works declare.","verse_reference":"Psalm 75:1","short_text":"Unto thee, O God, do we give thanks...","devotional":"Thanks for God’s near name and wondrous works.","prayer":"God, thank You for Your near name and works. Amen.","note":"Thanks for works.","mood_category":"grateful","verse_key":"grateful-ps75_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'At midnight I will rise to give thanks...', 'Psalm 119:62', '{"verse_text":"At midnight I will rise to give thanks unto thee because of thy righteous judgments.","verse_reference":"Psalm 119:62","short_text":"At midnight I will rise to give thanks...","devotional":"Rise even at midnight to thank for righteous judgments.","prayer":"Lord, I rise to thank You for Your righteous judgments. Amen.","note":"Midnight thanks.","mood_category":"grateful","verse_key":"grateful-ps119_62"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I exhort therefore, that, first of all...', '1 Timothy 2:1', '{"verse_text":"I exhort therefore, that, first of all, supplications, prayers, intercessions, and giving of thanks, be made for all men;","verse_reference":"1 Timothy 2:1","short_text":"I exhort therefore, that, first of all...","devotional":"Give thanks in prayers for all people.","prayer":"Father, I give thanks in prayers for all. Amen.","note":"Thanks for all men.","mood_category":"grateful","verse_key":"grateful-1tim2_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Saying, We give thee thanks, O Lord God Almighty...', 'Revelation 11:17', '{"verse_text":"Saying, We give thee thanks, O Lord God Almighty, which art, and wast, and art to come; because thou hast taken to thee thy great power, and hast reigned.","verse_reference":"Revelation 11:17","short_text":"Saying, We give thee thanks, O Lord God Almighty...","devotional":"Thanks to the Almighty for His power and reign.","prayer":"Lord God Almighty, thank You for Your power and reign. Amen.","note":"Thanks to Almighty.","mood_category":"grateful","verse_key":"grateful-rev11_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'grateful', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Come unto me, all ye that labour...', 'Matthew 11:28', '{"verse_text":"Come unto me, all ye that labour and are heavy laden, and I will give you rest.","verse_reference":"Matthew 11:28","short_text":"Come unto me, all ye that labour...","devotional":"Jesus invites the overwhelmed to find true rest in Him — lay down the weight.","prayer":"Jesus, I am heavy laden and overwhelmed. Give me rest today. Amen.","note":"Rest for the weary.","mood_category":"overwhelmed","verse_key":"overwhelmed-matt11_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Cast thy burden upon the LORD...', 'Psalm 55:22', '{"verse_text":"Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.","verse_reference":"Psalm 55:22","short_text":"Cast thy burden upon the LORD...","devotional":"Hand your overwhelming burdens to God — He sustains and steadies you.","prayer":"Lord, I cast my burdens on You. Sustain me so I am not moved. Amen.","note":"He sustains when burdened.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps55_22"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Casting all your care upon him...', '1 Peter 5:7', '{"verse_text":"Casting all your care upon him; for he careth for you.","verse_reference":"1 Peter 5:7","short_text":"Casting all your care upon him...","devotional":"Every stress and care is safe with Him — because He truly cares.","prayer":"Father, I cast all my cares on You because You care for me. Amen.","note":"He cares deeply.","mood_category":"overwhelmed","verse_key":"overwhelmed-1pet5_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;

-- Mood verses batch 6
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When my heart is overwhelmed...', 'Psalm 61:2', '{"verse_text":"From the end of the earth will I cry unto thee, when my heart is overwhelmed: lead me to the rock that is higher than I.","verse_reference":"Psalm 61:2","short_text":"When my heart is overwhelmed...","devotional":"Cry out when overwhelmed — God leads to higher, safer ground.","prayer":"Lord, my heart is overwhelmed. Lead me to the Rock higher than I. Amen.","note":"Higher Rock in overwhelm.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps61_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'God is our refuge and strength...', 'Psalm 46:1', '{"verse_text":"God is our refuge and strength, a very present help in trouble.","verse_reference":"Psalm 46:1","short_text":"God is our refuge and strength...","devotional":"When everything feels like too much, God is your immediate refuge.","prayer":"Lord, be my refuge and strength in this overwhelming trouble. Amen.","note":"Very present help.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps46_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'They that wait upon the LORD...', 'Isaiah 40:31', '{"verse_text":"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.","verse_reference":"Isaiah 40:31","short_text":"They that wait upon the LORD...","devotional":"Wait on God — strength renews and weariness lifts.","prayer":"Father, as I wait on You, renew my strength so I do not faint. Amen.","note":"Renewed strength.","mood_category":"overwhelmed","verse_key":"overwhelmed-isa40_31"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be careful for nothing...', 'Philippians 4:6-7', '{"verse_text":"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.","verse_reference":"Philippians 4:6-7","short_text":"Be careful for nothing...","devotional":"Turn overwhelm into prayer — God’s peace guards your heart.","prayer":"Lord, I bring my anxieties to You in prayer. Let Your peace guard me. Amen.","note":"Peace beyond understanding.","mood_category":"overwhelmed","verse_key":"overwhelmed-phil4_6-7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Therefore is my spirit overwhelmed...', 'Psalm 143:4', '{"verse_text":"Therefore is my spirit overwhelmed within me; my heart within me is desolate.","verse_reference":"Psalm 143:4","short_text":"Therefore is my spirit overwhelmed...","devotional":"God understands when your spirit feels completely overwhelmed.","prayer":"Father, my spirit is overwhelmed. Comfort and guide me. Amen.","note":"He knows overwhelm.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps143_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When my spirit was overwhelmed...', 'Psalm 142:3', '{"verse_text":"When my spirit was overwhelmed within me, then thou knewest my path...","verse_reference":"Psalm 142:3","short_text":"When my spirit was overwhelmed...","devotional":"Even in overwhelm, God knows your way forward.","prayer":"Lord, when my spirit is overwhelmed, You know my path. Lead me. Amen.","note":"He knows the path.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps142_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the world ye shall have tribulation...', 'John 16:33', '{"verse_text":"These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.","verse_reference":"John 16:33","short_text":"In the world ye shall have tribulation...","devotional":"Jesus gives peace amid tribulation — He has overcome.","prayer":"Jesus, in my tribulation, give me peace. You have overcome. Amen.","note":"Peace in the Overcomer.","mood_category":"overwhelmed","verse_key":"overwhelmed-jn16_33"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Fear thou not; for I am with thee...', 'Isaiah 41:10', '{"verse_text":"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.","verse_reference":"Isaiah 41:10","short_text":"Fear thou not; for I am with thee...","devotional":"God’s presence strengthens and upholds when you feel weak.","prayer":"Lord, I am dismayed. Strengthen, help, and uphold me. Amen.","note":"Uphold by His hand.","mood_category":"overwhelmed","verse_key":"overwhelmed-isa41_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Trust in him at all times...', 'Psalm 62:8', '{"verse_text":"Trust in him at all times; ye people, pour out your heart before him: God is a refuge for us.","verse_reference":"Psalm 62:8","short_text":"Trust in him at all times...","devotional":"Pour out your overwhelmed heart — God is your refuge.","prayer":"Lord, I pour out my heart to You. Be my refuge. Amen.","note":"Pour out — He listens.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps62_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My grace is sufficient for thee...', '2 Corinthians 12:9', '{"verse_text":"And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness...","verse_reference":"2 Corinthians 12:9","short_text":"My grace is sufficient for thee...","devotional":"God’s grace is enough — His strength shines in your weakness.","prayer":"Lord, Your grace is sufficient. Perfect Your strength in my weakness. Amen.","note":"Grace sufficient.","mood_category":"overwhelmed","verse_key":"overwhelmed-2cor12_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My soul melteth for heaviness...', 'Psalm 119:28', '{"verse_text":"My soul melteth for heaviness: strengthen thou me according unto thy word.","verse_reference":"Psalm 119:28","short_text":"My soul melteth for heaviness...","devotional":"When your soul melts under pressure, God’s Word strengthens.","prayer":"Father, my soul melts with heaviness. Strengthen me by Your Word. Amen.","note":"Strength from Word.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps119_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Hear my prayer, O LORD...', 'Psalm 102:1-2', '{"verse_text":"Hear my prayer, O LORD, and let my cry come unto thee. Hide not thy face from me in the day when I am in trouble...","verse_reference":"Psalm 102:1-2","short_text":"Hear my prayer, O LORD...","devotional":"Your cry reaches God — He does not hide in distress.","prayer":"Lord, hear my prayer and cry. Do not hide in this trouble. Amen.","note":"Cry is heard.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps102_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Turn thee unto me...', 'Psalm 25:16-17', '{"verse_text":"Turn thee unto me, and have mercy upon me; for I am desolate and afflicted. The troubles of my heart are enlarged...","verse_reference":"Psalm 25:16-17","short_text":"Turn thee unto me...","devotional":"In enlarged troubles, ask God to turn with mercy.","prayer":"Lord, turn to me in my affliction. Have mercy on my enlarged troubles. Amen.","note":"Mercy in trouble.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps25_16-17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'But I am poor and sorrowful...', 'Psalm 69:29', '{"verse_text":"But I am poor and sorrowful: let thy salvation, O God, set me up on high.","verse_reference":"Psalm 69:29","short_text":"But I am poor and sorrowful...","devotional":"When poor and overwhelmed, God lifts you high.","prayer":"Father, I am poor and sorrowful. Set me up high in Your salvation. Amen.","note":"Lifted high.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps69_29"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the day of my trouble...', 'Psalm 86:7', '{"verse_text":"In the day of my trouble I will call upon thee: for thou wilt answer me.","verse_reference":"Psalm 86:7","short_text":"In the day of my trouble...","devotional":"Call in the day of trouble — God answers.","prayer":"Lord, in this day of trouble I call on You. Answer me. Amen.","note":"Answer in trouble.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps86_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is nigh unto all them...', 'Psalm 145:18', '{"verse_text":"The LORD is nigh unto all them that call upon him, to all that call upon him in truth.","verse_reference":"Psalm 145:18","short_text":"The LORD is nigh unto all them...","devotional":"God is near to every true cry — call in overwhelm.","prayer":"Lord, I call upon You in truth. Draw near to me. Amen.","note":"Near to callers.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps145_18"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'He shall call upon me...', 'Psalm 91:15', '{"verse_text":"He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him.","verse_reference":"Psalm 91:15","short_text":"He shall call upon me...","devotional":"Call — God answers, stays, delivers, and honors.","prayer":"Lord, I call on You. Be with me in trouble and deliver me. Amen.","note":"Deliverance promised.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps91_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The righteous cry...', 'Psalm 34:17', '{"verse_text":"The righteous cry, and the LORD heareth, and delivereth them out of all their troubles.","verse_reference":"Psalm 34:17","short_text":"The righteous cry...","devotional":"Your cry reaches God — He delivers from every trouble.","prayer":"Lord, I cry to You. Hear and deliver me from all troubles. Amen.","note":"Deliverance from troubles.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps34_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'When thou passest through the waters...', 'Isaiah 43:2', '{"verse_text":"When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee...","verse_reference":"Isaiah 43:2","short_text":"When thou passest through the waters...","devotional":"God walks with you through overwhelming waters — they will not overflow.","prayer":"Lord, be with me through these waters. Keep them from overflowing. Amen.","note":"Not overflowed.","mood_category":"overwhelmed","verse_key":"overwhelmed-isa43_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In my distress I called upon the LORD...', 'Psalm 18:6', '{"verse_text":"In my distress I called upon the LORD, and cried unto my God: he heard my voice out of his temple...","verse_reference":"Psalm 18:6","short_text":"In my distress I called upon the LORD...","devotional":"From His temple, God hears your distressed cry.","prayer":"Lord, in distress I call. Hear my voice. Amen.","note":"Heard from temple.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps18_6"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be merciful unto me, O God...', 'Psalm 57:1', '{"verse_text":"Be merciful unto me, O God, be merciful unto me: for my soul trusteth in thee: yea, in the shadow of thy wings will I make my refuge...","verse_reference":"Psalm 57:1","short_text":"Be merciful unto me, O God...","devotional":"Find refuge in God’s wings when overwhelmed.","prayer":"Father, be merciful. I trust in You and take refuge under Your wings. Amen.","note":"Refuge in wings.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps57_1"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I cried unto thee, O LORD...', 'Psalm 142:5', '{"verse_text":"I cried unto thee, O LORD: I said, Thou art my refuge and my portion in the land of the living.","verse_reference":"Psalm 142:5","short_text":"I cried unto thee, O LORD...","devotional":"Cry to God — He is your refuge and portion.","prayer":"Lord, You are my refuge and portion. Hear my cry. Amen.","note":"Portion in living.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps142_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD also will be a refuge...', 'Psalm 9:9', '{"verse_text":"The LORD also will be a refuge for the oppressed, a refuge in times of trouble.","verse_reference":"Psalm 9:9","short_text":"The LORD also will be a refuge...","devotional":"God is refuge for the oppressed and stressed.","prayer":"Lord, be my refuge in this time of trouble. Amen.","note":"Refuge for oppressed.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps9_9"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be still, and know that I am God...', 'Psalm 46:10', '{"verse_text":"Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.","verse_reference":"Psalm 46:10","short_text":"Be still, and know that I am God...","devotional":"In chaos, be still — know He is God.","prayer":"Lord, help me be still and know that You are God. Amen.","note":"Be still.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps46_10"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD shall fight for you...', 'Exodus 14:14', '{"verse_text":"The LORD shall fight for you, and ye shall hold your peace.","verse_reference":"Exodus 14:14","short_text":"The LORD shall fight for you...","devotional":"Let God fight — you can rest in peace.","prayer":"Lord, fight for me today. Help me hold my peace. Amen.","note":"He fights.","mood_category":"overwhelmed","verse_key":"overwhelmed-exod14_14"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And the LORD, he it is that doth go before thee...', 'Deuteronomy 31:8', '{"verse_text":"And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.","verse_reference":"Deuteronomy 31:8","short_text":"And the LORD, he it is that doth go before thee...","devotional":"God goes before you — no failure or forsaking.","prayer":"Lord, go before me. I will not fear or be dismayed. Amen.","note":"He goes before.","mood_category":"overwhelmed","verse_key":"overwhelmed-deut31_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Commit thy way unto the LORD...', 'Psalm 37:5', '{"verse_text":"Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.","verse_reference":"Psalm 37:5","short_text":"Commit thy way unto the LORD...","devotional":"Commit your overwhelmed path to God — trust Him to act.","prayer":"Lord, I commit my way to You. Bring it to pass. Amen.","note":"He brings to pass.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps37_5"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will both lay me down in peace...', 'Psalm 4:8', '{"verse_text":"I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.","verse_reference":"Psalm 4:8","short_text":"I will both lay me down in peace...","devotional":"Sleep in peace — God keeps you safe.","prayer":"Lord, I lay down in peace because You keep me safe. Amen.","note":"Peaceful sleep.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps4_8"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Thou wilt keep him in perfect peace...', 'Isaiah 26:3', '{"verse_text":"Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.","verse_reference":"Isaiah 26:3","short_text":"Thou wilt keep him in perfect peace...","devotional":"Perfect peace for minds fixed on God.","prayer":"Lord, keep me in perfect peace as I trust in You. Amen.","note":"Perfect peace.","mood_category":"overwhelmed","verse_key":"overwhelmed-isa26_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is my shepherd...', 'Psalm 23:1-2', '{"verse_text":"The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.","verse_reference":"Psalm 23:1-2","short_text":"The LORD is my shepherd...","devotional":"The Shepherd provides rest and calm waters.","prayer":"Lord, my Shepherd, lead me beside still waters. Amen.","note":"Still waters.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps23_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Take therefore no thought for the morrow...', 'Matthew 6:34', '{"verse_text":"Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself...","verse_reference":"Matthew 6:34","short_text":"Take therefore no thought for the morrow...","devotional":"Let tomorrow worry about itself — focus on today.","prayer":"Jesus, help me not worry about tomorrow. Give me today’s strength. Amen.","note":"One day at a time.","mood_category":"overwhelmed","verse_key":"overwhelmed-matt6_34"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will lift up mine eyes unto the hills...', 'Psalm 121:1-2', '{"verse_text":"I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD...","verse_reference":"Psalm 121:1-2","short_text":"I will lift up mine eyes unto the hills...","devotional":"Look up — your help comes from the Lord.","prayer":"Lord, I lift my eyes to You. My help comes from You. Amen.","note":"Help from above.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps121_1-2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'The LORD is my strength...', 'Psalm 28:7', '{"verse_text":"The LORD is my strength and my shield; my heart trusted in him, and I am helped...","verse_reference":"Psalm 28:7","short_text":"The LORD is my strength...","devotional":"Trust brings help and strength when weak.","prayer":"Lord, You are my strength and shield. I trust and am helped. Amen.","note":"Strength and shield.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps28_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Notwithstanding the Lord stood with me...', '2 Timothy 4:17', '{"verse_text":"Notwithstanding the Lord stood with me, and strengthened me...","verse_reference":"2 Timothy 4:17","short_text":"Notwithstanding the Lord stood with me...","devotional":"The Lord stands with you and strengthens in distress.","prayer":"Lord, stand with me and strengthen me now. Amen.","note":"He stands.","mood_category":"overwhelmed","verse_key":"overwhelmed-2tim4_17"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Though I walk in the midst of trouble...', 'Psalm 138:7', '{"verse_text":"Though I walk in the midst of trouble, thou wilt revive me...","verse_reference":"Psalm 138:7","short_text":"Though I walk in the midst of trouble...","devotional":"God revives you in the midst of trouble.","prayer":"Lord, in the midst of trouble, revive me. Amen.","note":"Revival in trouble.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps138_7"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the multitude of my thoughts...', 'Psalm 94:19', '{"verse_text":"In the multitude of my thoughts within me thy comforts delight my soul.","verse_reference":"Psalm 94:19","short_text":"In the multitude of my thoughts...","devotional":"God’s comforts delight when thoughts multiply.","prayer":"Lord, in my many anxious thoughts, let Your comforts delight me. Amen.","note":"Comforts delight.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps94_19"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'My flesh and my heart faileth...', 'Psalm 73:26', '{"verse_text":"My flesh and my heart faileth: but God is the strength of my heart, and my portion for ever.","verse_reference":"Psalm 73:26","short_text":"My flesh and my heart faileth...","devotional":"When body and heart fail, God is your strength.","prayer":"Lord, when my heart fails, be my strength and portion. Amen.","note":"Strength of heart.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps73_26"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'For I know the thoughts that I think toward you...', 'Jeremiah 29:11', '{"verse_text":"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.","verse_reference":"Jeremiah 29:11","short_text":"For I know the thoughts that I think toward you...","devotional":"God’s thoughts are for your peace and future.","prayer":"Father, thank You for thoughts of peace toward me. Amen.","note":"Thoughts of peace.","mood_category":"overwhelmed","verse_key":"overwhelmed-jer29_11"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And we know that all things work together...', 'Romans 8:28', '{"verse_text":"And we know that all things work together for good to them that love God...","verse_reference":"Romans 8:28","short_text":"And we know that all things work together...","devotional":"Even overwhelm works for good in God’s hands.","prayer":"Lord, work all things for good in my life. Amen.","note":"All for good.","mood_category":"overwhelmed","verse_key":"overwhelmed-rom8_28"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Wait on the LORD...', 'Psalm 27:14', '{"verse_text":"Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.","verse_reference":"Psalm 27:14","short_text":"Wait on the LORD...","devotional":"Wait with courage — strength comes.","prayer":"Lord, I wait on You. Strengthen my heart with courage. Amen.","note":"Courage while waiting.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps27_14"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Be of good courage...', 'Psalm 31:24', '{"verse_text":"Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.","verse_reference":"Psalm 31:24","short_text":"Be of good courage...","devotional":"Hope in God brings courage and strength.","prayer":"Lord, I hope in You. Strengthen my heart with courage. Amen.","note":"Strength for hopers.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps31_24"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I sought the LORD, and he heard me...', 'Psalm 34:4', '{"verse_text":"I sought the LORD, and he heard me, and delivered me from all my fears.","verse_reference":"Psalm 34:4","short_text":"I sought the LORD, and he heard me...","devotional":"Seek Him — fears are delivered.","prayer":"Lord, I seek You. Deliver me from all fears. Amen.","note":"Delivered from fears.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps34_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'And call upon me in the day of trouble...', 'Psalm 50:15', '{"verse_text":"And call upon me in the day of trouble: I will deliver thee, and thou shalt glorify me.","verse_reference":"Psalm 50:15","short_text":"And call upon me in the day of trouble...","devotional":"Call in trouble — deliverance and glory follow.","prayer":"Lord, I call in trouble. Deliver me so I may glorify You. Amen.","note":"Call and deliver.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps50_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'I will cry unto God most high...', 'Psalm 57:2', '{"verse_text":"I will cry unto God most high; unto God that performeth all things for me.","verse_reference":"Psalm 57:2","short_text":"I will cry unto God most high...","devotional":"Cry to the Most High — He performs all for you.","prayer":"Lord Most High, I cry to You. Perform all things for me. Amen.","note":"He performs.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps57_2"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In the day when I cried...', 'Psalm 138:3', '{"verse_text":"In the day when I cried thou answeredst me, and strengthenedst me with strength in my soul.","verse_reference":"Psalm 138:3","short_text":"In the day when I cried...","devotional":"God answers cries and strengthens your soul.","prayer":"Lord, You answer and strengthen my soul. Thank You. Amen.","note":"Soul strengthened.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps138_3"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'In returning and rest shall ye be saved...', 'Isaiah 30:15', '{"verse_text":"For thus saith the Lord GOD, the Holy One of Israel; In returning and rest shall ye be saved; in quietness and in confidence shall be your strength...","verse_reference":"Isaiah 30:15","short_text":"In returning and rest shall ye be saved...","devotional":"Rest and quietness bring strength and salvation.","prayer":"Lord, help me return to rest and quiet confidence in You. Amen.","note":"Strength in rest.","mood_category":"overwhelmed","verse_key":"overwhelmed-isa30_15"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;
WITH ins AS (
  INSERT INTO cards (type, title, subtitle, content, points_reward, is_active, publish_date)
  VALUES ('verse', 'Stand in awe, and sin not...', 'Psalm 4:4', '{"verse_text":"Stand in awe, and sin not: commune with your own heart upon your bed, and be still.","verse_reference":"Psalm 4:4","short_text":"Stand in awe, and sin not...","devotional":"Be still and commune with God — peace follows.","prayer":"Lord, I stand in awe and be still. Commune with me. Amen.","note":"Be still.","mood_category":"overwhelmed","verse_key":"overwhelmed-ps4_4"}', 5, true, NULL)
  RETURNING id
)
INSERT INTO _mood_verse_ids (mood_category, card_id) SELECT 'overwhelmed', id FROM ins;

-- Link mood verses to their primary mood (weight=5)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Anxious'
WHERE mv.mood_category = 'anxious'
ON CONFLICT (card_id, mood_id) DO NOTHING;

INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Sad'
WHERE mv.mood_category = 'sad'
ON CONFLICT (card_id, mood_id) DO NOTHING;

INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Lonely'
WHERE mv.mood_category = 'lonely'
ON CONFLICT (card_id, mood_id) DO NOTHING;

INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Happy'
WHERE mv.mood_category = 'joyful'
ON CONFLICT (card_id, mood_id) DO NOTHING;

INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Grateful'
WHERE mv.mood_category = 'grateful'
ON CONFLICT (card_id, mood_id) DO NOTHING;

INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 5
FROM _mood_verse_ids mv
JOIN moods m ON m.name = 'Anxious'
WHERE mv.mood_category = 'overwhelmed'
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- Link mood verses to all other moods with lower weight (weight=1)
INSERT INTO card_moods (card_id, mood_id, weight)
SELECT mv.card_id, m.id, 1
FROM _mood_verse_ids mv
CROSS JOIN moods m
WHERE m.is_active = true
ON CONFLICT (card_id, mood_id) DO NOTHING;

-- Cleanup temp tables
DROP TABLE IF EXISTS _daily_verse_ids;
DROP TABLE IF EXISTS _mood_verse_ids;

COMMIT;
